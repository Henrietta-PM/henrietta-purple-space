export function isValidChallenge(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 20 && value.length <= 2000;
}