import axios, { AxiosRequestConfig } from "axios";
import * as crypto from "crypto";

const BASE_TIMEOUT = 15000;
const API_URL = "https://api.bitfinex.com";

let lastNonce = Date.now() * 1000;

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

  _request = async (url: string, payload: AxiosRequestConfig<any>) => {
    const response = await axios(url, payload);
    if (response.status !== 200) {
      throw this._apiError(response);
    }
    return JSON.parse(response.statusText);
  };

  _apiError = (response) =>
    new Error(`HTTP code ${response.status} ${response.statusText || ""}`);

  _makeAuthRequest = async (path, payload = {}) => {
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

    const reqOpts = {
      method: "POST",
      timeout: this._timeout,
      headers: {
        "content-type": "application/json",
        "bfx-nonce": n,
        ...auth,
      },
      agent: this._agent,
      body: JSON.stringify(payload),
    };

    return this._request(url, reqOpts);
  };

  _genAuthSig = (secret, payload = "") => {
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

  getNonce = () => {
    const now = Date.now() * 1000;
    lastNonce = lastNonce < now ? now : lastNonce + 1;
    return lastNonce;
  };
}
