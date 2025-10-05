import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Briefcase, User, Mail, MessageSquare } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/projects", label: "Projects", icon: Briefcase },
    { path: "/cv", label: "CV", icon: User },
    { path: "/letter", label: "Letter", icon: Mail },
    { path: "/contact", label: "Contact", icon: MessageSquare },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-display font-bold text-foreground hover:text-primary-visible transition-colors">
              MyPvrpleSpace
            </Link>
            
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-full">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-all px-4 py-2 rounded-full",
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
        <div className="flex items-center justify-around py-3 px-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all",
                  isActive
                    ? "text-white bg-primary/80 shadow-lg"
                    : "text-primary-visible hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
