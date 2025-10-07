import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import prdTemplateComplete from "@/assets/prd-template-complete.png";
import prdTemplateOverview from "@/assets/prd-template-overview.png";

interface ProductStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const products = [
  {
    title: "Complete 3-in-1 PRD Template",
    description: "Overview + User Flows + Epics, User Stories & Acceptance Criteria",
    subtitle: "Copy & Paste PRD Templates for PMs & Founders",
    image: prdTemplateComplete,
    url: "https://selar.com/49gf07l554",
    badge: "PREMIUM"
  },
  {
    title: "PRD Overview + User Flows Templates",
    description: "Essential templates for product documentation",
    subtitle: "Copy & Paste PRD Templates for PMs & Founders",
    image: prdTemplateOverview,
    url: "https://selar.com/1r76753817",
    badge: "MOST POPULAR"
  }
];

const ProductStoreModal = ({ isOpen, onClose }: ProductStoreModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display font-bold">
            Digital Product <span className="font-handwritten text-primary-visible">Store</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {products.map((product, index) => (
            <div key={index} className="glass rounded-[1.5rem] overflow-hidden hover:shadow-xl transition-all duration-350">
              <div className="relative h-64">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.subtitle}</p>
                <Button 
                  asChild 
                  variant="default" 
                  size="lg" 
                  className="w-full gap-2"
                >
                  <a href={product.url} target="_blank" rel="noopener noreferrer">
                    View Product
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductStoreModal;
