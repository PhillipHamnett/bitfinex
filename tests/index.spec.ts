import { Bitfinex } from "../src";

const bitfinex = new Bitfinex();

describe("Platform Status", () => {
  it("should be able to check if Bitfinex is operational", async () => {
    expect(await bitfinex.getPlatformStatus()).toBeDefined();
  });
});
describe("Ticker", () => {
  it("should show the specific ticket for a trading pair", async () => {
    const result = await bitfinex.getTicker("tBTCUSD");
    expect(result).toBeDefined();
    expect(result).toHaveProperty("bid");
    expect(result).toHaveProperty("ask");
    expect(result).toHaveProperty("dailyChange");
    expect(result).toHaveProperty("dailyChangePerc");
    expect(result).toHaveProperty("lastPrice");
    expect(result).toHaveProperty("volume");
    expect(result).toHaveProperty("high");
    expect(result).toHaveProperty("low");
  });
  it("should show the specific ticket for a funding asset", async () => {
    const result = await bitfinex.getTicker("fUSD");
    expect(result).toBeDefined();
    expect(result).toHaveProperty("frr");
    expect(result).toHaveProperty("bid");
    expect(result).toHaveProperty("bidPeriod");
    expect(result).toHaveProperty("bidSize");
    expect(result).toHaveProperty("ask");
    expect(result).toHaveProperty("askPeriod");
    expect(result).toHaveProperty("askSize");
    expect(result).toHaveProperty("dailyChange");
    expect(result).toHaveProperty("dailyChangePerc");
    expect(result).toHaveProperty("lastPrice");
    expect(result).toHaveProperty("volume");
    expect(result).toHaveProperty("high");
    expect(result).toHaveProperty("low");
  });
});
