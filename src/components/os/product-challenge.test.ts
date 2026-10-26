import { describe, expect, it } from "vitest";
import { isValidChallenge } from "../../../supabase/functions/product-challenge/validation";
import { isAllowedChallengeOrigin } from "../../../supabase/functions/product-challenge/origins";

describe("product challenge validation", () => {
  it("allows the actual editor preview origin", () => {
    expect(isAllowedChallengeOrigin("https://1fbb70ac-9159-464a-b1cf-9b99dfbd6927.lovableproject.com")).toBe(true);
  });
  it("keeps unrelated websites blocked", () => {
    expect(isAllowedChallengeOrigin("https://unrelated.lovableproject.com")).toBe(false);
    expect(isAllowedChallengeOrigin("https://henriettaofpm.online.attacker.com")).toBe(false);
  });
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