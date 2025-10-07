import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import HeartModal from "./HeartModal";
import { useIsMobile } from "@/hooks/use-mobile";

const FloatingActionButton = () => {
  const [showHeartModal, setShowHeartModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <div className={`fixed ${isMobile ? 'bottom-24 right-6' : 'bottom-8 right-8'} z-[9999] flex flex-col gap-3`}>
        <Button
          onClick={toggleTheme}
          size="icon"
          className="w-14 h-14 rounded-full glass shadow-xl hover:shadow-2xl transition-all duration-350 active:scale-95"
        >
          {theme === "dark" ? (
            <Sun className="w-6 h-6 text-foreground dark:text-primary-visible" />
          ) : (
            <Moon className="w-6 h-6 text-foreground dark:text-primary-visible" />
          )}
        </Button>
        
        <Button
          onClick={() => setShowHeartModal(true)}
          size="icon"
          className="w-14 h-14 rounded-full glass shadow-xl hover:shadow-2xl transition-all duration-350 active:scale-95"
        >
          <Heart className="w-6 h-6 text-foreground dark:text-primary-visible" fill="currentColor" />
        </Button>
      </div>

      <HeartModal isOpen={showHeartModal} onClose={() => setShowHeartModal(false)} />
    </>
  );
};

export default FloatingActionButton;
