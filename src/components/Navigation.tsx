import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Briefcase, FileText, Mail, User } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/projects", label: "Projects", icon: Briefcase },
    { path: "/cv", label: "CV", icon: FileText },
    { path: "/letter", label: "Letter", icon: Mail },
    { path: "/contact", label: "Contact", icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-display font-bold text-foreground hover:text-primary-visible transition-colors">
              MyPvrpleSpace
            </Link>
            
            <div className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-all px-6 py-2.5 rounded-full relative",
                    location.pathname === link.path
                      ? "text-white bg-primary shadow-lg"
                      : "text-primary-visible hover:text-white hover:bg-primary/20"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50" 
           style={{
             background: 'hsl(var(--glass-purple))',
             backdropFilter: 'blur(32px) saturate(180%)',
             WebkitBackdropFilter: 'blur(32px) saturate(180%)',
             borderTop: '1px solid hsl(var(--glass-purple-border))',
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
                    ? "text-white bg-primary shadow-lg"
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
