import type { LauncherId } from "./os-apps";

export interface LockNotice {
  app: LauncherId;
  title: string;
  body: string;
  time: string;
}

export const lockNotices: LockNotice[] = [
  { app: "projects", title: "Sally", body: "My newest product, an AI personal brand manager. Tap to see the case study.", time: "now" },
  { app: "projects", title: "ProxyMedicine", body: "1,400 patients and a 35% increase in conversion.", time: "2m ago" },
  { app: "letter", title: "Notes", body: "A letter from Henrietta to you, my potential team.", time: "5m ago" },
  { app: "hire", title: "Calendar", body: "A slot is open to chat about your next product.", time: "10m ago" },
];