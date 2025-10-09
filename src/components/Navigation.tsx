import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Briefcase, User, Mail, MessageSquare, ShoppingBag, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/projects", label: "Projects", icon: Briefcase },
    { path: "/cv", label: "CV", icon: User },
    { path: "/letter", label: "Letter", icon: Mail },
    { path: "/shop", label: "Shop", icon: ShoppingBag },
    { path: "/contact", label: "Contact", icon: MessageSquare },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-[40px] left-0 right-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-display font-bold text-foreground hover:text-primary-visible transition-colors">
              MyPvrpleSpace
            </Link>
            
            <div className="flex items-center gap-0.5 glass px-1 py-1 rounded-full text-xs lg:text-sm">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center gap-1 font-medium transition-all duration-350 px-2 lg:px-2.5 py-1.5 rounded-full whitespace-nowrap",
                      isActive
                        ? "text-white bg-primary/80 backdrop-blur-md border-0.5 border-primary/40 shadow-[0_12px_48px_0_rgba(0,0,0,0.08),0_4px_24px_0_rgba(0,0,0,0.04),inset_0_2px_4px_0_rgba(255,255,255,0.12)]"
                        : "text-primary-visible hover:text-white hover:bg-primary/20"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">{link.label}</span>
                  </Link>
                );
              })}
              
              <div className="h-5 w-px bg-foreground dark:bg-white mx-0.5" />
              
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                size="icon"
                className="w-8 h-8 lg:w-9 lg:h-9 rounded-full hover:bg-primary/20 transition-all"
                variant="ghost"
              >
                {theme === "dark" ? (
                  <Sun className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary-visible" />
                ) : (
                  <Moon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary-visible" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 glass" 
           style={{
             borderRadius: '2rem',
           }}>
        <div className="flex items-center justify-around py-2 px-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center justify-center p-2.5 rounded-[1.25rem] transition-all",
                  isActive
                    ? "text-white bg-primary/80 shadow-lg"
                    : "text-primary-visible hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
          
          <div className="h-8 w-px bg-foreground dark:bg-white mx-0.5" />
          
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center px-1 py-1.5 rounded-[1.25rem] transition-all text-primary-visible hover:text-white flex-shrink-0"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
