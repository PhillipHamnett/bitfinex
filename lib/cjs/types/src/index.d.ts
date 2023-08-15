import { AxiosRequestConfig, AxiosResponse } from "axios";
interface AuthenticationSignature {
    payload: string;
    sig: string;
    nonce: number;
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
export declare class Bitfinex {
    private _url;
    private _apiKey;
    private _apiSecret;
    private _authToken;
    private _company;
    private _transform;
    private _agent;
    private _affCode;
    private _timeout;
    constructor(opts?: {
        affCode: null;
        apiKey: string;
        apiSecret: string;
        authToken: string;
        company: string;
        url: string;
        transform: boolean;
        agent: null;
        timeout: number;
    });
    _request: (method: string, url: string, payload?: string, config?: AxiosRequestConfig) => Promise<any>;
    _apiError: (response: AxiosResponse<any, any>) => Error;
    _makeAuthRequest: (path: string, payload?: {}) => Promise<any>;
    _genAuthSig: (secret: string, payload?: string) => AuthenticationSignature;
    getNonce: () => number;
    getPlatformStatus: () => Promise<number>;
    getTicker: (pair: string) => Promise<TickerData>;
}
export {};
//# sourceMappingURL=index.d.ts.map