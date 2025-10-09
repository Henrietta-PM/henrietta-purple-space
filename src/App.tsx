import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useState } from "react";
import AnnouncementBanner from "./components/AnnouncementBanner";
import ScrollToTop from "./components/ScrollToTop";
import HeartModal from "./components/HeartModal";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import CV from "./pages/CV";
import Letter from "./pages/Letter";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface HeartModalContextType {
  openHeartModal: () => void;
}

const HeartModalContext = createContext<HeartModalContextType | undefined>(undefined);

export const useHeartModal = () => {
  const context = useContext(HeartModalContext);
  if (!context) {
    throw new Error("useHeartModal must be used within HeartModalProvider");
  }
  return context;
};

const App = () => {
  const [showHeartModal, setShowHeartModal] = useState(false);

  const openHeartModal = () => {
    console.log("🎯 App.tsx: openHeartModal called, setting showHeartModal to true");
    setShowHeartModal(true);
  };

  const closeHeartModal = () => {
    console.log("🎯 App.tsx: closeHeartModal called, setting showHeartModal to false");
    setShowHeartModal(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="portfolio-theme">
        <TooltipProvider>
          <HeartModalContext.Provider value={{ openHeartModal }}>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AnnouncementBanner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/cv" element={<CV />} />
                <Route path="/letter" element={<Letter />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shop" element={<Shop />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <HeartModal isOpen={showHeartModal} onClose={closeHeartModal} />
            </BrowserRouter>
          </HeartModalContext.Provider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
