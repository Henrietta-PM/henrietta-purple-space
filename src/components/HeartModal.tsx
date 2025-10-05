import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HeartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HeartModal = ({ isOpen, onClose }: HeartModalProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heartSent, setHeartSent] = useState(false);
  const [heartCount, setHeartCount] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchHeartCount = async () => {
      const { count } = await supabase
        .from("hearts")
        .select("*", { count: "exact", head: true });
      setHeartCount(count || 0);
    };

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
      setProgress(0);
      setIsHolding(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding && !heartSent && !isSending) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleHeartSent();
            return 100;
          }
          return prev + 2;
        });
      }, 20);
    } else if (!isHolding) {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, heartSent, isSending]);

  const handleHeartSent = async () => {
    if (isSending) return;
    
    setIsSending(true);
    setIsHolding(false);

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
      setProgress(0);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-primary/20 max-w-md">
        <div className="flex flex-col items-center gap-6 py-8">
          <h2 className="text-2xl font-display font-bold text-center">
            {heartSent ? "Henrietta has received your heart! 💜" : "Press and hold to leave a heart"}
          </h2>
          
          <div className="relative">
            <button
              onMouseDown={() => !heartSent && !isSending && setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
              onTouchStart={() => !heartSent && !isSending && setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
              disabled={heartSent || isSending}
              className={`relative w-32 h-32 rounded-full transition-all duration-300 ${
                heartSent 
                  ? "scale-110 animate-bounce" 
                  : "hover:scale-105"
              } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart
                className={`w-full h-full transition-all duration-300 ${
                  heartSent ? "fill-primary text-primary" : "text-primary"
                }`}
                style={{
                  fill: heartSent ? undefined : `rgba(139, 92, 246, ${progress / 100})`,
                }}
              />
              {!heartSent && !isSending && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(hsl(var(--primary)) ${progress * 3.6}deg, transparent 0deg)`,
                    opacity: 0.3,
                  }}
                />
              )}
            </button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {heartCount} 💜 sent, {heartSent ? "thank you!" : "add yours!"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeartModal;
