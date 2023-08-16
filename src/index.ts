import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as crypto from "crypto";

const BASE_TIMEOUT = 15000;
const API_URL = "https://api.bitfinex.com";

let lastNonce = Date.now() * 1000;

export interface GetPlatformStatusResponse {
  status: number[];
}
export interface AuthenticationSignature {
  payload: string;
  sig: string;
  nonce: number;
}
type GetTickerResponse = number[];
type TickersData = [string, ...number[]];
type GetTickersResponse = TickersData[];
export interface TickerTradeData {
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
  dailyChange: number;
  dailyChangePerc: number;
  lastPrice: number;
  volume: number;
  high: number;
  low: number;
}
export interface TickerFundingData {
  frr: number;
  bid: number;
  bidPeriod: number;
  bidSize: number;
  ask: number;
  askPeriod: number;
  askSize: number;
  dailyChange: number;
  dailyChangePerc: number;
  lastPrice: number;
  volume: number;
  high: number;
  low: number;
  frrAmountAvailable: number;
}
export interface TickersTradeData extends TickerTradeData {
  symbol: string;
}
export interface TickersFundingData extends TickerFundingData {
  symbol: string;
}
export interface TickersHistoryData {
  symbol: string;
  bid: number;
  ask: number;
  mts: number;
}
export interface TradeTradesData {
  id: number;
  mts: number;
  amount: number;
  price: number;
}
export interface TradeFundingData {
  id: number;
  mts: number;
  amount: number;
  rate: number;
  period: number;
}
type BookPrecision = "P0" | "P1" | "P2" | "P3" | "R0";
export interface BookTradeData {
  price: number;
  count: number;
  amount: number;
}
export interface BookTradeRawData {
  orderId: number;
  price: number;
  amount: number;
}
export interface BookFundingData {
  rate: number;
  period: number;
  count: number;
  amount: number;
}
export interface BookFundingRawData {
  offerId: number;
  rate: number;
  period: number;
  amount: number;
}
export class Bitfinex {
  private _url: string;
  private _apiKey: string;
  private _apiSecret: string;
  private _authToken: string;
  private _company: string;
  private _transform: boolean;
  private _agent: null;
  private _affCode: null;
  private _timeout: number;

  constructor(
    opts = {
      affCode: null,
      apiKey: "",
      apiSecret: "",
      authToken: "",
      company: "",
      url: API_URL,
      transform: false,
      agent: null,
      timeout: BASE_TIMEOUT,
    },
  ) {
    this._url = opts.url || API_URL;
    this._apiKey = opts.apiKey || "";
    this._apiSecret = opts.apiSecret || "";
    this._authToken = opts.authToken || "";
    this._company = opts.company || "";
    this._transform = !!opts.transform;
    this._agent = opts.agent;
    this._affCode = opts.affCode;
    this._timeout = BASE_TIMEOUT;
  }

  _request = async (
    method: string,
    url: string,
    payload: string = "",
    config: AxiosRequestConfig = {},
  ): Promise<any> => {
    url = `${this._url}/v2/${url}`;
    let response: AxiosResponse<any, any>;
    if (method === "get") response = await axios.get(url, config);
    else if (method === "put") response = await axios.put(url, payload, config);
    else if (method === "post")
      response = await axios.post(url, payload, config);
    else throw new Error("Invalid method");
    if (response.status !== 200) {
      throw this._apiError(response);
    }
    return response.data;
  };

  _apiError = (response: AxiosResponse<any, any>) =>
    new Error(`HTTP code ${response.status} ${response.statusText || ""}`);

  _makeAuthRequest = async (path: string, payload = {}) => {
    if ((!this._apiKey || !this._apiSecret) && !this._authToken) {
      throw new Error("missing api key or secret");
    }

    const url = `${this._url}/v2/${path}`;
    const n = this.getNonce();
    const keys = () => {
      const sigPayload = `/api/v2${path}${n}${JSON.stringify(payload)}`;
      const { sig } = this._genAuthSig(this._apiSecret, sigPayload);
      return { "bfx-apikey": this._apiKey, "bfx-signature": sig }; // TODO Make a type
    };
    const auth = this._authToken ? { "bfx-token": this._authToken } : keys();

    const config = {
      headers: {
        "content-type": "application/json",
        "bfx-nonce": n,
        ...auth,
      },
    };

    return this._request("post", url, JSON.stringify(payload), config);
  };

  _genAuthSig = (secret: string, payload = ""): AuthenticationSignature => {
    const nonce = this.getNonce();
    if (payload.length === 0) {
      payload = `AUTH${nonce}${nonce}`;
    }

    const sig = crypto
      .createHmac("sha384", secret)
      .update(payload)
      .digest("hex");

    return {
      payload,
      sig,
      nonce: this.getNonce(),
    };
  };

  getNonce = (): number => {
    const now = Date.now() * 1000;
    lastNonce = lastNonce < now ? now : lastNonce + 1;
    return lastNonce;
  };

  getPlatformStatus = async (): Promise<number> => {
    const result = await axios.get<GetPlatformStatusResponse>(
      `${this._url}/platform/status`,
    );
    if (result.status === 200) return 1;
    else return 0;
  };

  getTicker = async (
    pair: string,
  ): Promise<TickerTradeData | TickerFundingData | undefined> => {
    const url = `https://api-pub.bitfinex.com/v2/ticker/${pair}`;
    const response: AxiosResponse<GetTickerResponse> = await axios.get(url);
    if (response.status !== 200)
      throw new Error("Failed to get ticker: " + response.statusText);
    if (pair[0] === "t") {
      return {
        bid: response.data[0],
        bidSize: response.data[1],
        ask: response.data[2],
        askSize: response.data[3],
        dailyChange: response.data[4],
        dailyChangePerc: response.data[5],
        lastPrice: response.data[6],
        volume: response.data[7],
        high: response.data[8],
        low: response.data[9],
      } as TickerTradeData;
    } else
      return {
        frr: response.data[0],
        bid: response.data[1],
        bidPeriod: response.data[2],
        bidSize: response.data[3],
        ask: response.data[4],
        askPeriod: response.data[5],
        askSize: response.data[6],
        dailyChange: response.data[7],
        dailyChangePerc: response.data[8],
        lastPrice: response.data[9],
        volume: response.data[10],
        high: response.data[11],
        low: response.data[12],
        frrAmountAvailable: response.data[15], // Elements 13 and 14 are reserved
      } as TickerFundingData;
  };

  getTickers = async (): Promise<(TickersTradeData | TickersFundingData)[]> => {
    const url = `https://api-pub.bitfinex.com/v2/tickers?symbols=ALL`;
    const response: AxiosResponse<GetTickersResponse> = await axios.get(url);
    if (response.status !== 200)
      throw new Error("Failed to get tickers: " + response.statusText);
    return response.data.map((ticker) => {
      if (ticker[0][0] === "t") {
        return {
          symbol: ticker[0],
          bid: ticker[1],
          bidSize: ticker[2],
          ask: ticker[3],
          askSize: ticker[4],
          dailyChange: ticker[5],
          dailyChangePerc: ticker[6],
          lastPrice: ticker[7],
          volume: ticker[8],
          high: ticker[9],
          low: ticker[10],
        } as TickersTradeData;
      } else {
        return {
          symbol: ticker[0],
          frr: ticker[1],
          bid: ticker[2],
          bidPeriod: ticker[3],
          bidSize: ticker[4],
          ask: ticker[5],
          askPeriod: ticker[6],
          askSize: ticker[7],
          dailyChange: ticker[8],
          dailyChangePerc: ticker[9],
          lastPrice: ticker[10],
          volume: ticker[11],
          high: ticker[12],
          low: ticker[13],
          frrAmountAvailable: ticker[16], // Elements 14 and 15 are reserved
        } as TickersFundingData;
      }
    });
  };

  getTickersHistory = async (
    symbol: string = "ALL",
    limit: number = 250,
    start: string = "",
    end: string = "",
  ): Promise<TickersHistoryData[]> => {
    const url = `https://api-pub.bitfinex.com/v2/tickers/hist?symbols=${symbol}&limit=${limit}&start=${start}&end=${end}`;
    const response: AxiosResponse<GetTickersResponse> = await axios.get(url);
    if (response.status !== 200)
      throw new Error("Failed to get tickers history: " + response.statusText);
    return response.data.map((ticker) => {
      return {
        symbol: ticker[0],
        bid: ticker[1],
        ask: ticker[3],
        mts: ticker[12],
      };
    }) as TickersHistoryData[];
  };

  getTrades = async (
    symbol: string,
    limit: number = 10000,
    sort: number = -1,
    start: string = "",
    end: string = "",
  ): Promise<(TradeTradesData | TradeFundingData)[]> => {
    const url = `https://api-pub.bitfinex.com/v2/trades/${symbol}/hist?limit=${limit}&sort=${sort}&start=${start}&end=${end}`;
    const response: AxiosResponse<number[][]> = await axios.get(url);
    if (response.status !== 200)
      throw new Error("Failed to get trades: " + response.statusText);
    if (symbol[0] === "t") {
      return response.data.map((trade) => {
        return {
          id: trade[0],
          mts: trade[1],
          amount: trade[2],
          price: trade[3],
        };
      }) as TradeTradesData[];
    } else {
      return response.data.map((funding) => {
        return {
          id: funding[0],
          mts: funding[1],
          amount: funding[2],
          rate: funding[3],
          period: funding[4],
        };
      }) as TradeFundingData[];
    }
  };

  getBook = async (
    symbol: string,
    precision: BookPrecision,
    length: number = 100,
  ): Promise<
    (BookTradeData | BookFundingData | BookTradeRawData | BookFundingRawData)[]
  > => {
    const url = `https://api-pub.bitfinex.com/v2/book/${symbol}/${precision}?len=${length}`;
    const response: AxiosResponse<number[][]> = await axios.get(url);
    if (response.status !== 200)
      throw new Error("Failed to get book: " + response.statusText);
    if (symbol[0] === "t") {
      if (precision[0] === "P")
        return response.data.map((order) => {
          return {
            price: order[0],
            count: order[1],
            amount: order[2],
          };
        }) as BookTradeData[];
      else
        return response.data.map((order) => {
          return {
            orderId: order[0],
            price: order[1],
            amount: order[2],
          };
        }) as BookTradeRawData[];
    } else {
      if (precision[0] === "P")
        return response.data.map((order) => {
          return {
            rate: order[0],
            period: order[1],
            count: order[2],
            amount: order[3],
          };
        }) as BookFundingData[];
      else
        return response.data.map((order) => {
          return {
            offerId: order[0],
            period: order[1],
            rate: order[2],
            amount: order[3],
          };
        }) as BookFundingRawData[];
    }
  };

  getTradeCandles = async (
    timeframe: string,
    tradingPair: string,
    section: string = "hist",
    sort: number = -1,
    start: string = "",
    end: string = "",
    limit: number = 10000,
  ): Promise<number[][]> => {
    return [];
  };
}
