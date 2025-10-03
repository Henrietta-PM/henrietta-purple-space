import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/cv", label: "CV" },
    { path: "/letter", label: "Letter" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold text-foreground hover:text-primary transition-colors">
            MyPvrpleSpace
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-all px-4 py-2 rounded-[1rem] relative",
                  location.pathname === link.path
                    ? "text-foreground bg-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground p-2 z-50 relative"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed top-0 right-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          background: 'rgba(var(--glass-bg-strong))',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(var(--glass-border-strong))',
        }}
      >
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 text-foreground p-2 z-50"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col p-6 pt-20 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-sm font-medium transition-all px-4 py-3 rounded-[1rem]",
                location.pathname === link.path
                  ? "text-foreground bg-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;
