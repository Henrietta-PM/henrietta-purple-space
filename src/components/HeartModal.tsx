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
      setProgress(0);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-primary/20 max-w-md">
        <div className="flex flex-col items-center gap-6 py-8">
          <h2 className="text-lg font-display font-bold text-center">
            {heartSent ? "Henrietta has received your 💜" : "Press and hold to leave a heart"}
          </h2>
          
          <div className="relative">
            <button
              onMouseDown={() => !heartSent && !isSending && setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
              onTouchStart={() => !heartSent && !isSending && setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
              disabled={heartSent || isSending}
              className={`relative w-32 h-32 transition-all duration-300 ${
                heartSent 
                  ? "scale-110 animate-bounce" 
                  : "hover:scale-105"
              } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="relative w-full h-full">
                <Heart
                  className={`w-full h-full transition-all duration-300 ${
                    heartSent ? "fill-primary stroke-primary" : "stroke-white fill-transparent"
                  }`}
                  strokeWidth={2}
                />
                {!heartSent && !isSending && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
                      transform: 'scale(2.6)',
                      transformOrigin: 'center',
                    }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-200"
                      style={{
                        height: `${progress}%`,
                      }}
                    />
                  </div>
                )}
              </div>
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
