import { describe, expect, it } from "vitest";
import { blocksEmbedding, resolveAddress, safeWebsiteUrl, visitPage } from "./safari-navigation";
import { restoreLayout } from "./app-layout";

describe("Safari website navigation", () => {
  it("only permits HTTPS destinations without embedded credentials", () => {
    expect(safeWebsiteUrl("heysally.app")).toBe("https://heysally.app/");
    for (const url of ["javascript:alert(1)", "http://heysally.app", "https://user:pass@heysally.app", "data:text/html,hello"]) expect(safeWebsiteUrl(url)).toBeNull();
  });
  it("keeps websites known to deny embedding out of the frame", () => {
    expect(blocksEmbedding("https://www.prxy.health")).toBe(true);
    expect(blocksEmbedding("https://www.linkedin.com/company/sync-u/")).toBe(true);
    expect(blocksEmbedding("https://heysally.app")).toBe(false);
  });
  it("opens a typed domain like mykopa.app as a website", () => {
    expect(resolveAddress("mykopa.app", ["Sally"])).toEqual({ url:"https://mykopa.app/", mode:"website", projectName:undefined });
    expect(resolveAddress("http://mykopa.app", ["Sally"])?.url).toBe("https://mykopa.app/");
  });
  it("opens a project tour when a project name is typed", () => {
    expect(resolveAddress("sally", ["Sally"])).toMatchObject({ mode:"tour", projectName:"Sally" });
  });
  it("treats words without a domain as a search", () => {
    expect(resolveAddress("product manager", ["Sally"])).toMatchObject({ mode:"search", query:"product manager" });
    expect(resolveAddress("javascript:alert(1)", ["Sally"])).toMatchObject({ mode:"search" });
  });
  it("links a typed project domain back to its project", () => {
    expect(resolveAddress("heysally.app", ["Sally"], { Sally:"https://www.heysally.app" })?.projectName).toBe("Sally");
  });
  it("drops forward history only when a new page is visited", () => {
    const first = { url:"https://heysally.app", mode:"website" as const };
    const second = { url:"https://vibestacks.pro", mode:"website" as const };
    const next = { url:"https://targett-ai.lovable.app", mode:"website" as const };
    expect(visitPage([first,second],0,next)).toEqual([first,next]);
  });
  it("adds Safari without resetting visitor folders or positions", () => {
    const defaults = { dock:[{ id:"letter",apps:["letter"] },{ id:"mail",apps:["mail"] },{ id:"safari",apps:["safari"] }] };
    const saved = { dock:[{ id:"personal",apps:["letter","mail"],name:"My folder",position:{ x:.2,y:.4 } }] };
    expect(restoreLayout(saved,defaults)).toEqual({ dock:[...saved.dock,{ id:"safari",apps:["safari"] }] });
  });
});