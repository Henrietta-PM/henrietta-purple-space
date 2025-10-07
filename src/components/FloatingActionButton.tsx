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
        {/* Vertical backdrop container with integrated toggle */}
        <div 
          className={`glass rounded-full shadow-xl transition-all duration-500 ease-out ${
            isOpen ? 'h-[200px] w-48' : 'h-14 w-14'
          }`}
        >
          {/* Action Buttons Container */}
          <div className={`flex flex-col gap-2 p-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Heart Button */}
            <button
              onClick={() => {
                setShowHeartModal(true);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-full glass hover:bg-primary/10 transition-all duration-300 active:scale-95 group"
            >
              <Heart className="w-5 h-5 text-foreground dark:text-primary-visible flex-shrink-0" fill="currentColor" />
              <span className="text-sm font-medium text-foreground dark:text-white whitespace-nowrap">Send Love</span>
            </button>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 rounded-full glass hover:bg-primary/10 transition-all duration-300 active:scale-95 group"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-5 h-5 text-foreground dark:text-primary-visible flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground dark:text-white whitespace-nowrap">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-foreground dark:text-primary-visible flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground dark:text-white whitespace-nowrap">Dark Mode</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-px bg-border my-1" />
          </div>

          {/* Main Toggle Button - integrated at bottom */}
          <button
            onClick={toggleMenu}
            className={`flex items-center justify-center transition-all duration-300 active:scale-95 hover:bg-primary/10 ${
              isOpen ? 'absolute bottom-3 left-3 right-3 h-12 rounded-full' : 'w-14 h-14 rounded-full absolute inset-0'
            }`}
          >
            <Plus 
              className={`w-6 h-6 text-foreground dark:text-primary-visible transition-all duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
            />
            {isOpen && <span className="ml-2 text-sm font-medium text-foreground dark:text-white">Close</span>}
          </button>
        </div>
      </div>

      <HeartModal isOpen={showHeartModal} onClose={() => setShowHeartModal(false)} />
    </>
  );
};

export default FloatingActionButton;
