import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import AnnouncementBanner from "./components/AnnouncementBanner";
import ScrollToTop from "./components/ScrollToTop";
import RouteSeo from "./components/RouteSeo";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import CV from "./pages/CV";
import Letter from "./pages/Letter";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import PortfolioGuide from "./pages/PortfolioGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const Space = lazy(() => import("./pages/Space").then((module) => ({ default: module.Space })));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="portfolio-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <RouteSeo />
          <AnnouncementBanner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/letter" element={<Letter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/portfolio-guide" element={<PortfolioGuide />} />
            <Route path="/space" element={<Suspense fallback={<div className="min-h-screen" />}><Space /></Suspense>} />
            <Route path="/museum" element={<Navigate to="/space" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
