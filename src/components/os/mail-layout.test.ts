import { describe, expect, it } from "vitest";
import { restoreLayout } from "./app-layout";

describe("Mail layout upgrade", () => {
  it("adds Mail without resetting existing folders or positions", () => {
    const defaults = { dock: [{ id: "letter", apps: ["letter"] }, { id: "contact", apps: ["contact"] }, { id: "mail", apps: ["mail"] }] };
    const saved = { dock: [{ id: "personal", apps: ["letter", "contact"], name: "My folder", position: { x: 0.2, y: 0.4 } }] };
    expect(restoreLayout(saved, defaults)).toEqual({ dock: [...saved.dock, { id: "mail", apps: ["mail"] }] });
  });
  it("does not duplicate Mail in an existing folder", () => {
    const layout = { dock: [{ id: "folder", apps: ["letter", "mail"], name: "Work" }] };
    expect(restoreLayout(layout, { dock: [{ id: "letter", apps: ["letter"] }, { id: "mail", apps: ["mail"] }] })).toEqual({ dock: [{ ...layout.dock[0], position: undefined }] });
  });
});