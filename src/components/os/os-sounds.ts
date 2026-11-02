import { useEffect, useSyncExternalStore } from "react";
import reboundAsset from "@/assets/apple-rebound.mp3.asset.json";
import triToneAsset from "@/assets/apple-tri-tone.mp3.asset.json";

export type OsSound = "tap" | "open" | "close" | "notification" | "lock-notification" | "unlock";
const storageKey = "portfolio-sound-muted";
const listeners = new Set<() => void>();
let muted = false;
try { muted = localStorage.getItem(storageKey) === "true"; } catch { /* Storage is optional. */ }
let context: AudioContext | undefined;
let lastPlayed = 0;
const notificationBuffers = new Map<string, Promise<AudioBuffer | undefined>>();
let lastHaptic = 0;
let pendingLockAlert = false;

export function cancelLockAlert() {
  pendingLockAlert = false;
}

export function notificationRecording(kind: OsSound) {
  if (kind === "notification") return reboundAsset.url;
  if (kind === "lock-notification") return triToneAsset.url;
  return undefined;
}

function loadNotification(audio: AudioContext, url: string) {
  const cached = notificationBuffers.get(url);
  if (cached) return cached;
  const buffer = fetch(url)
    .then((response) => response.ok ? response.arrayBuffer() : Promise.reject())
    .then((bytes) => audio.decodeAudioData(bytes))
    .catch(() => {
      notificationBuffers.delete(url);
      return undefined;
    });
  notificationBuffers.set(url, buffer);
  return buffer;
}

export function soundAllowed(isMuted: boolean, activated: boolean, visible: boolean) {
  return !isMuted && activated && visible;
}

export function hasAppleSound(kind: OsSound) {
  return notificationRecording(kind) !== undefined;
}

export function activateOsAudio() {
  try {
    context ??= new AudioContext();
    void loadNotification(context, reboundAsset.url);
    void loadNotification(context, triToneAsset.url);
    const audio = context;
    const flushLockAlert = () => {
      if (pendingLockAlert && soundAllowed(muted, audio.state === "running", document.visibilityState === "visible")) {
        pendingLockAlert = false;
        playOsSound("lock-notification");
      }
    };
    if (audio.state !== "running") void audio.resume().then(flushLockAlert).catch(() => undefined);
    else flushLockAlert();
  } catch { /* Audio is optional on unsupported browsers. */ }
}

export function playOsSound(kind: OsSound) {
  const url = notificationRecording(kind);
  if (!url) {
    if (soundAllowed(muted, navigator.userActivation?.hasBeenActive === true, document.visibilityState === "visible") && typeof navigator.vibrate === "function" && Date.now() - lastHaptic > 60) {
      lastHaptic = Date.now();
      navigator.vibrate(10);
    }
    return;
  }
  const audio = context;
  if (!soundAllowed(muted, audio?.state === "running", document.visibilityState === "visible") || !audio) {
    if (kind === "lock-notification" && !muted && document.visibilityState === "visible") pendingLockAlert = true;
    return;
  }
  const now = audio.currentTime;
  if (lastPlayed > 0 && now - lastPlayed < 0.06) return;
  lastPlayed = now;
  if (url) {
    void loadNotification(audio, url).then((buffer) => {
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
}

export function useOsSoundPreference() {
  const isMuted = useSyncExternalStore((listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => muted, () => false);
  return { muted: isMuted, toggleMuted: () => {
    muted = !muted;
    if (muted) cancelLockAlert();
    try { localStorage.setItem(storageKey, String(muted)); } catch { /* Storage is optional. */ }
    listeners.forEach((listener) => listener());
    if (!muted) { activateOsAudio(); playOsSound("tap"); }
  } };
}

export function useOsInteractionSounds(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const onPointer = (event: Event) => {
      if (event.isTrusted && event.target instanceof Element && event.target.closest(".mac-shell,.ios-shell")) activateOsAudio();
    };
    const onClick = (event: MouseEvent) => {
      if (!event.isTrusted || !(event.target instanceof Element)) return;
      const control = event.target.closest("button,a,[role='button'],[role='tab'],[role='switch']");
      if (!control?.closest(".mac-shell,.ios-shell") || control.matches(":disabled,[aria-disabled='true']") || control.closest("[data-sound-control]")) return;
      activateOsAudio();
      playOsSound("tap");
    };
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("touchend", onPointer, true);
    document.addEventListener("keydown", onPointer, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("touchend", onPointer, true);
      document.removeEventListener("keydown", onPointer, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [enabled]);
}