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
        {/* Action Buttons - appear in a circular pattern */}
        <div className={`absolute bottom-0 right-0 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Theme Toggle Button */}
          <Button
            onClick={toggleTheme}
            size="icon"
            className="absolute w-12 h-12 rounded-full glass shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            style={{
              transform: isOpen ? 'translate(-80px, -10px)' : 'translate(0, 0)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-foreground dark:text-primary-visible" />
            ) : (
              <Moon className="w-5 h-5 text-foreground dark:text-primary-visible" />
            )}
          </Button>
          
          {/* Heart Button */}
          <Button
            onClick={() => {
              setShowHeartModal(true);
              setIsOpen(false);
            }}
            size="icon"
            className="absolute w-12 h-12 rounded-full glass shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            style={{
              transform: isOpen ? 'translate(-60px, -60px)' : 'translate(0, 0)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s',
            }}
          >
            <Heart className="w-5 h-5 text-foreground dark:text-primary-visible" fill="currentColor" />
          </Button>
        </div>

        {/* Main Toggle Button */}
        <Button
          onClick={toggleMenu}
          size="icon"
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary-hover shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 relative"
        >
          <Plus 
            className={`w-6 h-6 text-primary-foreground absolute transition-all duration-300 ${isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`}
          />
          <X 
            className={`w-6 h-6 text-primary-foreground absolute transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'}`}
          />
        </Button>
      </div>

      <HeartModal isOpen={showHeartModal} onClose={() => setShowHeartModal(false)} />
    </>
  );
};

export default FloatingActionButton;
