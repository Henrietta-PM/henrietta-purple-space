import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Sun, Moon, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import HeartModal from "./HeartModal";
import { useIsMobile } from "@/hooks/use-mobile";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`fixed ${isMobile ? 'bottom-24 right-6' : 'bottom-8 right-8'} z-[9999]`}>
        {/* Vertical elongating backdrop */}
        <div 
          className={`glass rounded-full shadow-xl transition-all duration-500 ease-out overflow-hidden ${
            isOpen ? 'h-[240px] w-14' : 'h-14 w-14'
          }`}
        >
          {/* Action Buttons Container */}
          <div className={`flex flex-col items-center transition-all duration-300 delay-100 ${isOpen ? 'opacity-100 pt-4' : 'opacity-0 pt-0'}`}>
            {/* Heart Button with label */}
            <div className="flex flex-col items-center gap-1.5 mb-4">
              <Button
                onClick={() => {
                  setShowHeartModal(true);
                  setIsOpen(false);
                }}
                size="icon"
                className="w-12 h-12 rounded-full glass shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              >
                <Heart className="w-5 h-5 text-foreground dark:text-primary-visible" fill="currentColor" />
              </Button>
              <span className="text-[9px] font-medium text-foreground/80 dark:text-white/80">Love</span>
            </div>
            
            {/* Theme Toggle Button with label */}
            <div className="flex flex-col items-center gap-1.5 mb-4">
              <Button
                onClick={toggleTheme}
                size="icon"
                className="w-12 h-12 rounded-full glass shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-foreground dark:text-primary-visible" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground dark:text-primary-visible" />
                )}
              </Button>
              <span className="text-[9px] font-medium text-foreground/80 dark:text-white/80">Theme</span>
            </div>

            {/* Subtle divider line */}
            <div className="w-8 h-px bg-border mb-3" />
          </div>

          {/* Main Toggle Button - always at bottom */}
          <div className={`absolute transition-all duration-500 ${isOpen ? 'bottom-3' : 'bottom-0 inset-x-0'}`}>
            <Button
              onClick={toggleMenu}
              size="icon"
              variant="ghost"
              className="w-14 h-14 rounded-full hover:bg-primary/10 transition-all duration-300 active:scale-95 mx-auto"
            >
              <Plus 
                className={`w-6 h-6 text-foreground dark:text-primary-visible transition-all duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
              />
            </Button>
          </div>
        </div>
      </div>

      <HeartModal isOpen={showHeartModal} onClose={() => setShowHeartModal(false)} />
    </>
  );
};

export default FloatingActionButton;
