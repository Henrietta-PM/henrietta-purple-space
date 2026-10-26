import { describe, expect, it } from "vitest";
import { flightHours, haversineKm } from "./journey-math";

describe("journey distance", () => {
  it("measures Lagos to London at about 5,000 km", () => {
    const km = haversineKm({ lat: 6.4549, lng: 3.4246 }, { lat: 51.5072, lng: -0.1276 });
    expect(km).toBeGreaterThan(4950);
    expect(km).toBeLessThan(5050);
  });
  it("estimates 800 km as 1 h 30 min of flight", () => {
    expect(flightHours(800)).toBe("1 h 30 min");
  });
});
