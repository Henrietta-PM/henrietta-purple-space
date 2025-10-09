import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HeartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HeartModal = ({ isOpen, onClose }: HeartModalProps) => {
  const [heartSent, setHeartSent] = useState(false);
  const [heartCount, setHeartCount] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const fetchHeartCount = async () => {
    const { count } = await supabase
      .from("hearts")
      .select("*", { count: "exact", head: true });
    setHeartCount(count || 0);
  };

  useEffect(() => {
    fetchHeartCount();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("hearts-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "hearts",
        },
        () => {
          fetchHeartCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setHeartSent(false);
    }
  }, [isOpen]);

  const handleHeartSent = async () => {
    if (isSending || heartSent) return;
    
    setIsSending(true);

    try {
      // Insert heart into database
      const { error: dbError } = await supabase.from("hearts").insert({});
      
      if (dbError) throw dbError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke("send-heart-email");
      
      if (emailError) {
        console.error("Email error:", emailError);
        // Don't throw - the heart was still recorded
      }

      setHeartSent(true);
      
      // Immediately update the count locally
      await fetchHeartCount();
      
      toast({
        title: "Heart sent! 💜",
        description: "Thank you for your support!",
      });
    } catch (error) {
      console.error("Error sending heart:", error);
      toast({
        title: "Error",
        description: "Failed to send heart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-primary/20 max-w-md rounded-3xl">
        <DialogTitle className="text-sm font-display font-bold text-center -mt-2">
          {heartSent ? "Thank you for loving my portfolio! 💜" : "Love this portfolio? Send a 💜!"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {heartSent ? "Your heart has been sent successfully" : "Click the heart to show your support"}
        </DialogDescription>
        <div className="flex flex-col items-center gap-4 py-8">
          
          <div className="relative">
            <button
              onClick={handleHeartSent}
              disabled={heartSent || isSending}
              className={`relative w-32 h-32 transition-all duration-150 ${
                heartSent 
                  ? "scale-110 animate-bounce" 
                  : "hover:scale-105 active:scale-95"
              } ${isSending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Heart
                className={`w-full h-full transition-all duration-200 ${
                  heartSent 
                    ? "fill-primary stroke-primary drop-shadow-[0_0_20px_hsl(var(--primary))]" 
                    : "stroke-foreground dark:stroke-white fill-transparent"
                }`}
                strokeWidth={1.5}
              />
            </button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {heartCount} people love this portfolio 💜
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeartModal;
