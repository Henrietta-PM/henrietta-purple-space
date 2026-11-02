import { describe, expect, it, vi } from "vitest";
import { activateOsAudio, cancelLockAlert, hasAppleSound, notificationRecording, playOsSound, soundAllowed } from "./os-sounds";

describe("OS sounds", () => {
  it("uses the Apple recording only for notifications, not fake interaction tones", () => {
    expect(hasAppleSound("notification")).toBe(true);
    expect(hasAppleSound("lock-notification")).toBe(true);
    for (const kind of ["tap", "open", "close", "unlock"] as const) expect(hasAppleSound(kind)).toBe(false);
  });
  it("uses Tri-tone for lock arrivals and a separate Rebound recording for popups", () => {
    expect(notificationRecording("lock-notification")).toContain("apple-tri-tone.mp3");
    expect(notificationRecording("notification")).toContain("apple-rebound.mp3");
    expect(notificationRecording("lock-notification")).not.toBe(notificationRecording("notification"));
  });
  it("allows sounds after interaction while visible and unmuted", () => {
    expect(soundAllowed(false, true, true)).toBe(true);
  });
  it("silences notifications and clicks when muted", () => {
    expect(soundAllowed(true, true, true)).toBe(false);
  });
  it("never plays before the visitor activates audio", () => {
    expect(soundAllowed(false, false, true)).toBe(false);
  });
  it("silences a background tab", () => {
    expect(soundAllowed(false, true, false)).toBe(false);
  });
  it("plays a pending lock alert after the first interaction resumes audio", async () => {
    const start = vi.fn();
    const audio = {
      state: "suspended", currentTime: 1, destination: {},
      resume: vi.fn(async () => { audio.state = "running"; }),
      decodeAudioData: vi.fn(async () => ({})),
      createBufferSource: () => ({ connect: vi.fn(), disconnect: vi.fn(), start, buffer: undefined, onended: undefined }),
      createGain: () => ({ gain: { value: 0 }, connect: vi.fn(), disconnect: vi.fn() }),
    };
    vi.stubGlobal("document", { visibilityState: "visible" });
    vi.stubGlobal("AudioContext", vi.fn(() => audio));
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) })));
    playOsSound("lock-notification");
    expect(start).not.toHaveBeenCalled();
    activateOsAudio();
    await vi.waitFor(() => expect(start).toHaveBeenCalledTimes(1));
    cancelLockAlert();
    activateOsAudio();
    expect(start).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});