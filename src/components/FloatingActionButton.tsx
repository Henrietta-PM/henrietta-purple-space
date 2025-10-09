import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHeartModal } from "@/App";

const FloatingActionButton = () => {
  const { openHeartModal } = useHeartModal();
  const isMobile = useIsMobile();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("💜 Floating action button clicked");
    openHeartModal();
  };

  return (
    <div className={`fixed ${isMobile ? 'bottom-24 right-6' : 'bottom-8 right-8'} z-[9999]`}>
      <Button
        onClick={handleClick}
        size="icon"
        className="w-14 h-14 rounded-full glass shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95"
      >
        <Heart className="w-6 h-6 text-foreground dark:text-primary-visible" fill="currentColor" />
      </Button>
    </div>
  );
};

export default FloatingActionButton;
