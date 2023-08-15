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
    expect(result).toHaveProperty("frrAmountAvailable");
  });
});

describe("Tickers", () => {
  it("should show all tickers", async () => {
    const result = await bitfinex.getTickers();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("symbol");
    const tradeTickers = result.filter((ticker) => ticker.symbol[0] === "t")[0];
    expect(tradeTickers).toHaveProperty("bid");
    expect(tradeTickers).toHaveProperty("bidSize");
    expect(tradeTickers).toHaveProperty("ask");
    expect(tradeTickers).toHaveProperty("askSize");
    expect(tradeTickers).toHaveProperty("dailyChange");
    expect(tradeTickers).toHaveProperty("dailyChangePerc");
    expect(tradeTickers).toHaveProperty("lastPrice");
    expect(tradeTickers).toHaveProperty("volume");
    expect(tradeTickers).toHaveProperty("high");
    expect(tradeTickers).toHaveProperty("low");
    const fundingTickers = result.filter(
      (ticker) => ticker.symbol[0] === "f",
    )[0];
    expect(fundingTickers).toHaveProperty("frr");
    expect(fundingTickers).toHaveProperty("bid");
    expect(fundingTickers).toHaveProperty("bidPeriod");
    expect(fundingTickers).toHaveProperty("bidSize");
    expect(fundingTickers).toHaveProperty("ask");
    expect(fundingTickers).toHaveProperty("askPeriod");
    expect(fundingTickers).toHaveProperty("askSize");
    expect(fundingTickers).toHaveProperty("dailyChange");
    expect(fundingTickers).toHaveProperty("dailyChangePerc");
    expect(fundingTickers).toHaveProperty("lastPrice");
    expect(fundingTickers).toHaveProperty("volume");
    expect(fundingTickers).toHaveProperty("high");
    expect(fundingTickers).toHaveProperty("low");
    expect(fundingTickers).toHaveProperty("frrAmountAvailable");
  });
});

describe("Tickers History", () => {});
