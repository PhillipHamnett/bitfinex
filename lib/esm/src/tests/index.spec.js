import { Bitfinex } from "../src";
const bitfinex = new Bitfinex();
describe("Platform Status", () => {
    it("should be able to check if Bitfinex is operational", async () => {
        expect(await bitfinex.getPlatformStatus()).toBeDefined();
    });
});
describe("Ticker", () => {
    it("should show the specific ticket for a pair", async () => {
        expect(await bitfinex.getTicker("tBTCUSD")).toBeDefined();
    });
});
