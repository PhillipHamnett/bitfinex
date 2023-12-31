import axios from "axios";
import * as crypto from "crypto";
const BASE_TIMEOUT = 15000;
const API_URL = "https://api.bitfinex.com";
let lastNonce = Date.now() * 1000;
export class Bitfinex {
    _url;
    _apiKey;
    _apiSecret;
    _authToken;
    _company;
    _transform;
    _agent;
    _affCode;
    _timeout;
    constructor(opts = {
        affCode: null,
        apiKey: "",
        apiSecret: "",
        authToken: "",
        company: "",
        url: API_URL,
        transform: false,
        agent: null,
        timeout: BASE_TIMEOUT,
    }) {
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
    _request = async (method, url, payload = "", config = {}) => {
        url = `${this._url}/v2/${url}`;
        let response;
        if (method === "get")
            response = await axios.get(url, config);
        else if (method === "put")
            response = await axios.put(url, payload, config);
        else if (method === "post")
            response = await axios.post(url, payload, config);
        else
            throw new Error("Invalid method");
        if (response.status !== 200) {
            throw this._apiError(response);
        }
        return response.data;
    };
    _apiError = (response) => new Error(`HTTP code ${response.status} ${response.statusText || ""}`);
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
        const config = {
            headers: {
                "content-type": "application/json",
                "bfx-nonce": n,
                ...auth,
            },
        };
        return this._request("post", url, JSON.stringify(payload), config);
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
    getPlatformStatus = async () => {
        const result = await axios.get(`${this._url}/platform/status`);
        if (result.status === 200)
            return 1;
        else
            return 0;
    };
    getTicker = async (pair) => {
        const url = `/ticker/${pair}`;
        const response = await axios.get(url);
        if (response.status !== 200)
            throw new Error("Failed to get ticker: " + response.statusText);
        console.log(response.data.data);
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
        };
    };
}
const main = async () => {
    const bitfinex = new Bitfinex();
    console.log(await bitfinex.getTicker("tBTCUSD"));
};
main();
