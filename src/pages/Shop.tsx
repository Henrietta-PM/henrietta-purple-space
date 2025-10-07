import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const products = [
  {
    title: "Product Requirements Document Template",
    subtitle: "Complete Notion Template",
    image: "/src/assets/prd-template-overview.png",
    url: "https://henriettabaddams.gumroad.com/l/productdoctemplate",
    badge: "Popular"
  },
  {
    title: "AI Product Design Framework",
    subtitle: "Strategic Guide",
    image: "/src/assets/prd-template-complete.png",
    url: "https://henriettabaddams.gumroad.com/l/aiproductdesign",
    badge: "New"
  }
];

const Shop = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      
      <main className="pt-40 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              Digital <span className="font-handwritten text-primary-visible">Products</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Tools and templates to help you build better products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {products.map((product, index) => (
              <div
                key={index}
                className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-350 group"
              >
                {product.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-primary/80 text-white text-xs font-semibold rounded-full">
                      {product.badge}
                    </span>
                  </div>
                )}
                
                <div className="aspect-video w-full overflow-hidden bg-muted/50">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-muted-foreground mb-4">{product.subtitle}</p>

                  <Button
                    asChild
                    className="w-full"
                  >
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      View Product
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
