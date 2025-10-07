import { useScrollFade } from "@/hooks/use-scroll-fade";
import { LucideIcon } from "lucide-react";

interface SocialCardProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SocialCard = ({ href, icon: Icon, label }: SocialCardProps) => {
  const { ref, opacity, translateY } = useScrollFade();

  return (
    <a
      ref={ref as any}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-6 glass rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-350 flex flex-col items-center gap-3 group"
      style={{ opacity, transform: `translateY(${translateY}px)` }}
    >
      <Icon className="w-8 h-8 text-primary-visible" />
      <p className="font-semibold text-sm">{label}</p>
    </a>
  );
};

export default SocialCard;
