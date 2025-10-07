import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Plus, X } from "lucide-react";
import HeartModal from "./HeartModal";
import ProductStoreModal from "./ProductStoreModal";
import { useIsMobile } from "@/hooks/use-mobile";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const isMobile = useIsMobile();

  const handleHeartClick = () => {
    setIsOpen(false);
    setShowHeartModal(true);
  };

  const handleStoreClick = () => {
    setIsOpen(false);
    setShowStoreModal(true);
  };

  return (
    <>
      <div className={`fixed ${isMobile ? 'bottom-24 right-6' : 'bottom-8 right-8'} z-50`}>
        {/* Action Buttons */}
        <div className={`absolute bottom-16 right-0 flex flex-col gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          {/* Heart Button */}
          <Button
            onClick={handleHeartClick}
            size="icon"
            className="w-12 h-12 rounded-full glass border-2 border-primary/20 hover:border-primary/40 transition-all duration-350 shadow-lg"
          >
            <Heart className="w-5 h-5 text-primary-visible" fill="hsl(var(--primary-visible))" />
          </Button>
          
          {/* Store Button */}
          <Button
            onClick={handleStoreClick}
            size="icon"
            className="w-12 h-12 rounded-full glass border-2 border-primary/20 hover:border-primary/40 transition-all duration-350 shadow-lg"
          >
            <ShoppingBag className="w-5 h-5 text-primary-visible" />
          </Button>
        </div>

        {/* Main FAB */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="w-14 h-14 rounded-full bg-primary/80 hover:bg-primary shadow-xl hover:shadow-2xl transition-all duration-350"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>

      <HeartModal isOpen={showHeartModal} onClose={() => setShowHeartModal(false)} />
      <ProductStoreModal isOpen={showStoreModal} onClose={() => setShowStoreModal(false)} />
    </>
  );
};

export default FloatingActionButton;
