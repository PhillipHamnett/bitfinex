import { AxiosRequestConfig, AxiosResponse } from "axios";
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
    _request: (url: string, payload: AxiosRequestConfig<any>) => Promise<any>;
    _apiError: (response: AxiosResponse<any, any>) => Error;
    _makeAuthRequest: (path: string, payload?: {}) => Promise<any>;
    _genAuthSig: (secret: string, payload?: string) => {
        payload: string;
        sig: string;
        nonce: number;
    };
    getNonce: () => number;
    getPlatformStatus: () => Promise<any>;
}
//# sourceMappingURL=index.d.ts.map