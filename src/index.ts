import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as crypto from "crypto";

const BASE_TIMEOUT = 15000;
const API_URL = "https://api.bitfinex.com";

let lastNonce = Date.now() * 1000;

interface GetPlatformStatusResponse {
  status: number[];
}
interface AuthenticationSignature {
  payload: string;
  sig: string;
  nonce: number;
}
interface GetTickerResponse {
  data: number[];
}
interface TickerData {
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

  getTicker = async (pair: string): Promise<TickerData> => {
    const url = `/ticker/${pair}`;
    const response: AxiosResponse<GetTickerResponse> = await axios.get(url);
    if (response.status !== 200)
      throw new Error("Failed to get ticker: " + response.statusText);
    return {
      bid: response.data.data[0],
      bidSize: response.data.data[1],
      ask: response.data.data[2],
      askSize: response.data.data[3],
      dailyChange: response.data.data[4],
      dailyChangePerc: response.data.data[5],
      lastPrice: response.data.data[6],
      volume: response.data.data[7],
      high: response.data.data[8],
      low: response.data.data[9],
    } as TickerData;
  };
}
