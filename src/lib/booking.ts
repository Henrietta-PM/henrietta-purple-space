import type { MouseEvent } from "react";

export const HIRE_CALENDAR_URL = "https://calendar.app.google/huCPxAdY72xxtChe6";

export const openHireCalendar = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  event.preventDefault();

  const openedWindow = window.open(HIRE_CALENDAR_URL, "_blank");

  if (openedWindow) {
    openedWindow.opener = null;
    openedWindow.focus();
    return;
  }

  window.location.assign(HIRE_CALENDAR_URL);
};