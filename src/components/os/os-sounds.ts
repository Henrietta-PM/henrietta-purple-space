import { useEffect, useSyncExternalStore } from "react";
import reboundAsset from "@/assets/apple-rebound.mp3.asset.json";

export type OsSound = "tap" | "open" | "close" | "notification" | "unlock";
const storageKey = "portfolio-sound-muted";
const listeners = new Set<() => void>();
let muted = false;
try { muted = localStorage.getItem(storageKey) === "true"; } catch { /* Storage is optional. */ }
let context: AudioContext | undefined;
let tapTimer: ReturnType<typeof setTimeout> | undefined;
let lastPlayed = 0;
let notificationBuffer: Promise<AudioBuffer | undefined> | undefined;

function loadNotification(audio: AudioContext) {
  notificationBuffer ??= fetch(reboundAsset.url)
    .then((response) => response.ok ? response.arrayBuffer() : Promise.reject())
    .then((bytes) => audio.decodeAudioData(bytes))
    .catch(() => undefined);
  return notificationBuffer;
}

export function soundAllowed(isMuted: boolean, activated: boolean, visible: boolean) {
  return !isMuted && activated && visible;
}

export function activateOsAudio() {
  try {
    context ??= new AudioContext();
    void loadNotification(context);
    if (context.state === "suspended") void context.resume().catch(() => undefined);
  } catch { /* Audio is optional on unsupported browsers. */ }
}

export function playOsSound(kind: OsSound) {
  clearTimeout(tapTimer);
  const audio = context;
  if (!soundAllowed(muted, audio?.state === "running", document.visibilityState === "visible") || !audio) return;
  const now = audio.currentTime;
  if (now - lastPlayed < 0.06) return;
  lastPlayed = now;
  if (kind === "notification") {
    void loadNotification(audio).then((buffer) => {
      if (!buffer || !soundAllowed(muted, audio.state === "running", document.visibilityState === "visible")) return;
      const source = audio.createBufferSource();
      const gain = audio.createGain();
      source.buffer = buffer;
      gain.gain.value = 0.6;
      source.connect(gain);
      gain.connect(audio.destination);
      source.start();
      source.onended = () => { source.disconnect(); gain.disconnect(); };
    });
    return;
  }
  const tone = (frequency: number, delay: number, duration: number, volume: number, endFrequency = frequency) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now + delay);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + delay + duration);
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(volume, now + delay + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now + delay);
    oscillator.stop(now + delay + duration + 0.01);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  };
  switch (kind) {
    case "open": tone(440, 0, 0.16, 0.025, 740); break;
    case "close": tone(620, 0, 0.14, 0.022, 330); break;
    case "unlock": tone(660, 0, 0.16, 0.03); tone(990, 0.07, 0.22, 0.025); break;
    case "tap": tone(920, 0, 0.035, 0.018, 600); break;
  }
}

export function useOsSoundPreference() {
  const isMuted = useSyncExternalStore((listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => muted, () => false);
  return { muted: isMuted, toggleMuted: () => {
    muted = !muted;
    try { localStorage.setItem(storageKey, String(muted)); } catch { /* Storage is optional. */ }
    listeners.forEach((listener) => listener());
    if (!muted) { activateOsAudio(); playOsSound("tap"); }
  } };
}

export function useOsInteractionSounds(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const onPointer = (event: PointerEvent) => {
      if (event.isTrusted && event.target instanceof Element && event.target.closest(".mac-shell,.ios-shell")) activateOsAudio();
    };
    const onClick = (event: MouseEvent) => {
      if (!event.isTrusted || !(event.target instanceof Element)) return;
      const control = event.target.closest("button,a,[role='button'],[role='tab'],[role='switch']");
      if (!control?.closest(".mac-shell,.ios-shell") || control.matches(":disabled,[aria-disabled='true']") || control.closest("[data-sound-control]")) return;
      activateOsAudio();
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => playOsSound("tap"), 35);
    };
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("click", onClick, true);
    return () => {
      clearTimeout(tapTimer);
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [enabled]);
}