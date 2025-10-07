import { useScrollFade } from "@/hooks/use-scroll-fade";
import { ReactNode } from "react";

interface ContactCardProps {
  children: ReactNode;
}

const ContactCard = ({ children }: ContactCardProps) => {
  const { ref, opacity, translateY } = useScrollFade();

  return (
    <div
      ref={ref}
      className="glass p-8 rounded-[1.5rem]"
      style={{ opacity, transform: `translateY(${translateY}px)` }}
    >
      {children}
    </div>
  );
};

export default ContactCard;
