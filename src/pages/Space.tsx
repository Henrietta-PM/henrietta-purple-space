import { useIsMobile } from "@/hooks/use-mobile";
import { MacDesktop } from "@/components/os/mac-desktop";
import { IphoneHome } from "@/components/os/iphone-home";
import { useOsTheme } from "@/components/os/use-os-theme";
import "@/components/os/os.css";

export function Space() {
  const isMobile = useIsMobile();
  const { theme } = useOsTheme();
  return <main className={`os-root ${theme === "dark" ? "os-dark" : ""}`}>{isMobile ? <IphoneHome /> : <MacDesktop />}</main>;
}
