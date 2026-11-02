import { describe, expect, it } from "vitest";
import { soundAllowed } from "./os-sounds";

describe("OS sounds", () => {
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
});