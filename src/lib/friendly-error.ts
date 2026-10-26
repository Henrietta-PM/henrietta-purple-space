export class RateLimitError extends Error {
  constructor() {
    super("rate_limited");
    this.name = "RateLimitError";
  }
}

export function friendlyError(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof RateLimitError) return "You can send one message a minute. Please wait a moment and try again.";
  return fallback;
}
