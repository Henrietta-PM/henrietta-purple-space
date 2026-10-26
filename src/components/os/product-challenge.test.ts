import { describe, expect, it } from "vitest";
import { isValidChallenge } from "../../../supabase/functions/product-challenge/validation";

describe("product challenge validation", () => {
  it("requires at least 20 meaningful characters", () => {
    expect(isValidChallenge("a".repeat(19))).toBe(false);
    expect(isValidChallenge("a".repeat(20))).toBe(true);
    expect(isValidChallenge(" ".repeat(20))).toBe(false);
  });
  it("limits challenges to 2,000 characters", () => {
    expect(isValidChallenge("a".repeat(2000))).toBe(true);
    expect(isValidChallenge("a".repeat(2001))).toBe(false);
  });
  it("rejects nontext submissions", () => {
    expect(isValidChallenge({ challenge: "a".repeat(20) })).toBe(false);
  });
});