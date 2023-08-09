import { Bitfinex } from "../src";
const bitfinex = new Bitfinex();
describe("Platform Status", () => {
    it("should be able to check if Bitfinex is operational", async () => {
        expect(await bitfinex.getPlatformStatus()).toBe({});
    });
});
