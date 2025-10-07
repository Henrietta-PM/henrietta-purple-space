import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Sun, Moon, Plus, X } from "lucide-react";
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
        {/* Vertical backdrop container */}
        <div 
          className={`absolute bottom-0 right-0 bg-primary rounded-full shadow-xl transition-all duration-500 ease-out ${
            isOpen ? 'h-[200px] w-14' : 'h-14 w-14'
          }`}
        >
          {/* Action Buttons Container */}
          <div className={`flex flex-col items-center gap-4 pt-4 px-1 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Heart Button */}
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
            
            {/* Theme Toggle Button */}
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
          </div>

          {/* Main Toggle Button */}
          <Button
            onClick={toggleMenu}
            size="icon"
            variant="ghost"
            className={`absolute bottom-1 right-0 w-14 h-14 rounded-full hover:bg-primary-hover transition-all duration-300 active:scale-95`}
          >
            <Plus 
              className={`w-6 h-6 text-primary-foreground transition-all duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
            />
          </Button>
        </div>
      </div>

      <HeartModal isOpen={showHeartModal} onClose={() => setShowHeartModal(false)} />
    </>
  );
};

export default FloatingActionButton;
