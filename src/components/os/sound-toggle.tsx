import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOsSoundPreference } from "./os-sounds";

export default function SoundToggle() {
  const { muted, toggleMuted } = useOsSoundPreference();
  return <Button variant="ghost" size="icon" data-sound-control className="os-sound-toggle" aria-label={muted ? "Unmute sounds" : "Mute sounds"} aria-pressed={!muted} title={muted ? "Unmute sounds" : "Mute sounds"} onClick={toggleMuted}>{muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}</Button>;
}