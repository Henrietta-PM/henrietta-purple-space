import { useState } from "react";
import HeartModal from "./HeartModal";

const AnnouncementBanner = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="fixed top-0 left-0 right-0 z-50 overflow-hidden cursor-pointer bg-primary/20 backdrop-blur-md border-b border-primary/30"
        style={{ height: "40px" }}
      >
        <div className="animate-scroll whitespace-nowrap inline-block py-2 text-sm font-medium text-white">
          <span className="inline-block px-8">
            👋Hi, I built my portfolio from scratch. This shows the tenacity and details I'm ready to put into your project. Click this banner to drop a heart for me if you think my portfolio looks great!
          </span>
          <span className="inline-block px-8">
            👋Hi, I built my portfolio from scratch. This shows the tenacity and details I'm ready to put into your project. Click this banner to drop a heart for me if you think my portfolio looks great!
          </span>
          <span className="inline-block px-8">
            👋Hi, I built my portfolio from scratch. This shows the tenacity and details I'm ready to put into your project. Click this banner to drop a heart for me if you think my portfolio looks great!
          </span>
        </div>
      </div>
      <HeartModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default AnnouncementBanner;
