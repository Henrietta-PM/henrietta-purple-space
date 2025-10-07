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
        {/* Circular Background */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80 transition-all duration-500 ${
            isOpen ? 'w-48 h-48 opacity-100 scale-100' : 'w-14 h-14 opacity-0 scale-50'
          }`}
        />

        {/* Action Buttons - Positioned vertically on left inside circle */}
        <div className="relative">
          {/* Heart Button - Upper position */}
          <Button
            onClick={handleHeartClick}
            size="icon"
            className={`absolute w-12 h-12 rounded-full glass border-2 border-white/40 hover:border-white/60 transition-all duration-500 shadow-lg ${
              isOpen 
                ? 'opacity-100 scale-100 -translate-x-16 -translate-y-10' 
                : 'opacity-0 scale-50 translate-x-0 translate-y-0 pointer-events-none'
            }`}
            style={{ left: '1px', top: '1px' }}
          >
            <Heart className="w-5 h-5 text-white" fill="white" />
          </Button>
          
          {/* Store Button - Lower position */}
          <Button
            onClick={handleStoreClick}
            size="icon"
            className={`absolute w-12 h-12 rounded-full glass border-2 border-white/40 hover:border-white/60 transition-all duration-500 shadow-lg ${
              isOpen 
                ? 'opacity-100 scale-100 -translate-x-16 translate-y-10' 
                : 'opacity-0 scale-50 translate-x-0 translate-y-0 pointer-events-none'
            }`}
            style={{ left: '1px', top: '1px' }}
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Main FAB */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="relative w-14 h-14 rounded-full bg-primary/80 hover:bg-primary shadow-xl hover:shadow-2xl transition-all duration-350 z-10"
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
