import { useHeartModal } from "@/App";

const AnnouncementBanner = () => {
  const { openHeartModal } = useHeartModal();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🎉 Announcement banner clicked");
    openHeartModal();
  };

  return (
    <div 
      onClick={handleClick}
      className="fixed top-0 left-0 right-0 z-50 overflow-hidden cursor-pointer bg-primary/20 backdrop-blur-md border-b border-primary/30"
      style={{ height: "40px" }}
    >
      <div className="animate-scroll whitespace-nowrap inline-block py-2 text-sm font-medium text-foreground dark:text-white">
        <span className="inline-block px-8">
          👋 Hi, I designed this portfolio myself, and I'll bring the same energy to your project. Tap here to drop a 💜 if you love it!
        </span>
        <span className="inline-block px-8">
          👋 Hi, I designed this portfolio myself, and I'll bring the same energy to your project. Tap here to drop a 💜 if you love it!
        </span>
        <span className="inline-block px-8">
          👋 Hi, I designed this portfolio myself, and I'll bring the same energy to your project. Tap here to drop a 💜 if you love it!
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
