import { describe, expect, it } from "vitest";
import { isContactMail, OWNER_EMAIL, MAIL_COOLDOWN_SECONDS } from "../../../supabase/functions/send-contact-email/validation";

describe("Portfolio Mail", () => {
  const mail = { name: "Visitor", email: "visitor@example.com", subject: "Collaboration", message: "Let's discuss a product." };
  it("delivers only to the confirmed portfolio email", () => {
    expect(OWNER_EMAIL).toBe("mypvrplespace@gmail.com");
  });
  it("preserves the one-minute spam limit", () => {
    expect(MAIL_COOLDOWN_SECONDS).toBe(60);
  });
  it("accepts a complete message and rejects missing sender identity", () => {
    expect(isContactMail(mail)).toBe(true);
    expect(isContactMail({ ...mail, email: "invalid" })).toBe(false);
    expect(isContactMail({ ...mail, name: "" })).toBe(false);
  });
  it("rejects header injection, blank messages and spam traps", () => {
    expect(isContactMail({ ...mail, subject: "Hello\r\nBcc: other@example.com" })).toBe(false);
    expect(isContactMail({ ...mail, message: " " })).toBe(false);
    expect(isContactMail({ ...mail, website: "bot" })).toBe(false);
    expect(isContactMail({ ...mail, message: "x".repeat(3001) })).toBe(false);
  });
});