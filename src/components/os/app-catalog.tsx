import type { ReactNode } from "react";
import { AppIcon, ImageIcon, ProjectIcon, allProjects, launchers, type LauncherId } from "./os-apps";
import settingsIcon from "@/assets/apple-settings-icon.jpg";
import type { AppLayout, LayoutApp } from "./app-layout";

export interface OrganizedApp extends LayoutApp {
  icon: ReactNode;
  launcher?: LauncherId;
  projectName?: string;
}

const categoryFor = (id: LauncherId): string => {
  if (["camera", "photos"].includes(id)) return "Photo & Video";
  if (["instagram", "linkedin", "x", "contact", "love", "messages"].includes(id)) return "Social";
  if (["letter", "reminders", "hire", "mail"].includes(id)) return "Productivity";
  return "Portfolio";
};

export const appCatalog: OrganizedApp[] = [
  ...launchers.map((launcher) => ({ id: launcher.id, name: launcher.name, category: categoryFor(launcher.id), launcher: launcher.id, icon: <AppIcon launcher={launcher} size="lg" /> })),
  ...allProjects.map((project) => ({ id: `project:${project.name}`, name: project.name.replace(" Attendance System", ""), category: "Projects", projectName: project.name, icon: <ProjectIcon project={project} size="lg" /> })),
  { id: "settings", name: "Settings", category: "Utilities", icon: <ImageIcon src={settingsIcon} size="lg" /> },
  ...launchers.filter((launcher) => ["cv", "letter"].includes(launcher.id)).map((launcher) => ({ id: `shortcut:${launcher.id}`, name: launcher.id === "cv" ? "CV.pdf" : "Letter.note", category: "Portfolio", launcher: launcher.id, icon: <AppIcon launcher={launcher} size="md" /> })),
];

const tiles = (ids: string[]) => ids.map((id) => ({ id, apps: [id] }));
export const phoneLayout: AppLayout = {
  home0: tiles(["projects", "cv", "messages", "health", "reminders", "maps", "shop", "camera", "photos", "settings"]),
  home1: tiles(["mail", ...allProjects.map((project) => `project:${project.name}`), "instagram", "linkedin", "x"]),
  dock: tiles(["contact", "love", "letter", "hire"]),
};
export const desktopLayout: AppLayout = {
  desktop: tiles(["shortcut:cv", "shortcut:letter"]),
  dock: tiles(launchers.map((launcher) => launcher.id)),
};