import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOsSoundPreference } from "./os-sounds";

export default function SoundToggle({ mobile = false }: { mobile?: boolean }) {
  const { muted, toggleMuted } = useOsSoundPreference();
  return <Button variant="ghost" size="icon" data-sound-control className={mobile ? "ios-sound-toggle" : "os-sound-toggle"} aria-label={muted ? "Unmute sounds" : "Mute sounds"} aria-pressed={!muted} title={muted ? "Unmute sounds" : "Mute sounds"} onClick={toggleMuted}>{muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}</Button>;
}