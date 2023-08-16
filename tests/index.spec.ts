import {
  Bitfinex,
  BookFundingData,
  BookFundingRawData,
  BookTradeData,
  BookTradeRawData,
  TradeFundingData,
  TradeTradesData,
} from "../src";

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

describe("Tickers History", () => {
  it("should show the history of all tickers", async () => {
    const result = await bitfinex.getTickersHistory();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("symbol");
    expect(result[0]).toHaveProperty("bid");
    expect(result[0]).toHaveProperty("ask");
    expect(result[0]).toHaveProperty("mts");
  });
});
describe("Trades", () => {
  it("should show the trades for a trading pair", async () => {
    const result = (await bitfinex.getTrades("tBTCUSD"))[0] as TradeTradesData;
    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("mts");
    expect(result).toHaveProperty("amount");
    expect(result).toHaveProperty("price");
  });
  it("should show the trades for a funding pair", async () => {
    const result = (await bitfinex.getTrades("fUSD"))[0] as TradeFundingData;
    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("mts");
    expect(result).toHaveProperty("amount");
    expect(result).toHaveProperty("rate");
    expect(result).toHaveProperty("period");
  });
});

describe("Book", () => {
  it("should show the trading pair book", async () => {
    const result = (await bitfinex.getBook(
      "tBTCUSD",
      "P0",
      25,
    )) as BookTradeData[];
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("price");
    expect(result[0]).toHaveProperty("count");
    expect(result[0]).toHaveProperty("amount");
  });
  it("should show the funding pair book", async () => {
    const result = (await bitfinex.getBook(
      "fUSD",
      "P0",
      25,
    )) as BookFundingData[];
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("rate");
    expect(result[0]).toHaveProperty("period");
    expect(result[0]).toHaveProperty("count");
    expect(result[0]).toHaveProperty("amount");
  });
  it("should show the raw trading pair book", async () => {
    const result = (await bitfinex.getBook(
      "tBTCUSD",
      "R0",
      25,
    )) as BookTradeRawData[];
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("orderId");
    expect(result[0]).toHaveProperty("price");
    expect(result[0]).toHaveProperty("amount");
  });
  it("should show the raw funding pair book", async () => {
    const result = (await bitfinex.getBook(
      "fUSD",
      "R0",
      25,
    )) as BookFundingRawData[];
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("offerId");
    expect(result[0]).toHaveProperty("period");
    expect(result[0]).toHaveProperty("rate");
    expect(result[0]).toHaveProperty("amount");
  });
});

describe("Candles", () => {
  it("should show the historical candles for a trading pair", async () => {
    const result = await bitfinex.getTradeCandles(
      "1m",
      "tBTCUSD",
      "hist",
      -1,
      "",
      "",
      2,
    );
  });
});
