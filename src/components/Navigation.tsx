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
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 glass px-2 py-2 rounded-full">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-full",
                        isActive
                          ? "text-white bg-primary/80 shadow-lg"
                          : "text-primary-visible hover:text-white hover:bg-primary/20"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                size="icon"
                className="glass w-10 h-10 rounded-full hover:bg-primary/20 transition-all"
                variant="ghost"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-primary-visible" />
                ) : (
                  <Moon className="w-5 h-5 text-primary-visible" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50" 
           style={{
             background: 'hsl(253 35% 40% / 0.7)',
             backdropFilter: 'blur(32px) saturate(180%)',
             WebkitBackdropFilter: 'blur(32px) saturate(180%)',
             borderTop: '1px solid hsl(var(--glass-purple-border))',
             borderRadius: '2rem 2rem 0 0',
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
                  "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all min-w-0",
                  isActive
                    ? "text-white bg-primary/80 shadow-lg"
                    : "text-primary-visible hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] font-medium truncate">{link.label}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all min-w-0 text-primary-visible hover:text-white"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 flex-shrink-0" />
            ) : (
              <Moon className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="text-[10px] font-medium truncate">Theme</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
