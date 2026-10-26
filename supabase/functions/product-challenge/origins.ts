const allowedOrigins = new Set([
  "http://localhost:8080",
  "https://henriettaofpm.online",
  "https://www.henriettaofpm.online",
  "https://hirehenrietta.lovable.app",
  "https://id-preview--1fbb70ac-9159-464a-b1cf-9b99dfbd6927.lovable.app",
  "https://1fbb70ac-9159-464a-b1cf-9b99dfbd6927.lovableproject.com",
]);

export function isAllowedChallengeOrigin(origin: string): boolean {
  return allowedOrigins.has(origin);
}