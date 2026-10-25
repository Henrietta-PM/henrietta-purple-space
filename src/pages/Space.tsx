import { useIsMobile } from "@/hooks/use-mobile";
import { MacDesktop } from "@/components/os/mac-desktop";
import { IphoneHome } from "@/components/os/iphone-home";
import "@/components/os/os.css";

export function Space() {
  const isMobile = useIsMobile();
  return <main className="os-root">{isMobile ? <IphoneHome /> : <MacDesktop />}</main>;
}
