import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingActionButton from "@/components/FloatingActionButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center glass p-12 rounded-[2rem] max-w-md mx-6">
          <h1 className="mb-4 text-6xl font-display font-bold text-primary-visible">404</h1>
          <p className="mb-6 text-xl">Oops! Page not found</p>
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default NotFound;
