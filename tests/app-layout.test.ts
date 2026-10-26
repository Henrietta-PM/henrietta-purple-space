import { describe, expect, test } from "bun:test";
import { extractApp, folderName, moveTile, restoreLayout, type AppLayout } from "../src/components/os/app-layout";

const defaults: AppLayout = { home: [{ id: "camera", apps: ["camera"] }, { id: "photos", apps: ["photos"] }], dock: [] };
const catalog = [{ id: "camera", name: "Camera", category: "Photo & Video" }, { id: "photos", name: "Photos", category: "Photo & Video" }];

describe("visitor app organization", () => {
  test("apps can move between screen and dock without duplicating", () => {
    expect(moveTile(defaults, "camera", "dock")).toEqual({ home: [{ id: "photos", apps: ["photos"] }], dock: [{ id: "camera", apps: ["camera"], position: undefined }] });
  });
  test("grouping photo apps names the folder Photo & Video", () => {
    const grouped = moveTile(defaults, "camera", "home", "photos", true, catalog);
    expect(grouped.home[0].name).toBe("Photo & Video");
    expect(grouped.home[0].apps).toEqual(["photos", "camera"]);
  });
  test("mixed app categories get the general Apps name", () => {
    expect(folderName(["camera", "cv"], [...catalog, { id: "cv", name: "CV", category: "Portfolio" }])).toBe("Apps");
  });
  test("removing an app dissolves a one-app folder", () => {
    const grouped = moveTile(defaults, "camera", "home", "photos", true, catalog);
    expect(extractApp(grouped, "photos", "camera").home.map((tile) => tile.apps)).toEqual([["photos"], ["camera"]]);
  });
  test("saved layouts cannot lose apps or insert unknown apps", () => {
    expect(restoreLayout({ home: [], dock: [] }, defaults)).toBe(defaults);
    expect(restoreLayout({ home: [{ id: "bad", apps: ["unknown"] }], dock: [] }, defaults)).toBe(defaults);
  });
  test("saved folders and order restore on return", () => {
    const grouped = moveTile(defaults, "camera", "home", "photos", true, catalog);
    expect(restoreLayout(JSON.parse(JSON.stringify(grouped)), defaults)).toEqual(grouped);
  });
});