import { Linkedin, Twitter, Instagram, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import HeartModal from "./HeartModal";

const Footer = () => {
  const [showHeartModal, setShowHeartModal] = useState(false);

  return (
    <>
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">
              © 2025 Henrietta Onwuneme. All rights reserved.
            </p>
            
            <div className="flex items-center gap-3">
              <Button asChild size="sm" className="gap-2 text-xs md:text-sm px-3 md:px-4">
                <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-4 h-4" />
                  Hire Henrietta
                </a>
              </Button>
              <Button 
                onClick={() => setShowHeartModal(true)}
                variant="secondary"
                size="sm"
                className="gap-2 text-xs md:text-sm px-3 md:px-4"
              >
                <Heart className="w-4 h-4" />
                Send Heart
              </Button>
            </div>
            
            <div className="flex gap-6">
            <a
              href="https://linkedin.com/in/henrietta-onwuneme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/henrietta_bby"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/henriettaofpm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          </div>
        </div>
      </footer>
      <HeartModal isOpen={showHeartModal} onClose={() => setShowHeartModal(false)} />
    </>
  );
};

export default Footer;
