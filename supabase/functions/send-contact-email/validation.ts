export const OWNER_EMAIL = "mypvrplespace@gmail.com";
export const MAIL_COOLDOWN_SECONDS = 60;
export interface ContactMail { name: string; email: string; subject: string; message: string; website?: string }

export function isContactMail(value: unknown): value is ContactMail {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  const header = (field: unknown, max: number) => typeof field === "string" && field.trim().length > 0 && field.length <= max && !/[\r\n]/.test(field);
  return header(input.name, 80) && header(input.subject, 150) && header(input.email, 254)
    && typeof input.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
    && typeof input.message === "string" && input.message.trim().length > 0 && input.message.length <= 3000
    && (input.website === undefined || input.website === "");
}