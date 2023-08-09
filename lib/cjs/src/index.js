"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitfinex = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const BASE_TIMEOUT = 15000;
const API_URL = "https://api.bitfinex.com";
let lastNonce = Date.now() * 1000;
class Bitfinex {
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
        this._request = (url, payload) => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, axios_1.default)(url, payload);
            if (response.status !== 200) {
                throw this._apiError(response);
            }
            return JSON.parse(response.statusText);
        });
        this._apiError = (response) => new Error(`HTTP code ${response.status} ${response.statusText || ""}`);
        this._makeAuthRequest = (path, payload = {}) => __awaiter(this, void 0, void 0, function* () {
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
                headers: Object.assign({ "content-type": "application/json", "bfx-nonce": n }, auth),
                agent: this._agent,
                body: JSON.stringify(payload),
            };
            return this._request(url, reqOpts);
        });
        this._genAuthSig = (secret, payload = "") => {
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
        this.getNonce = () => {
            const now = Date.now() * 1000;
            lastNonce = lastNonce < now ? now : lastNonce + 1;
            return lastNonce;
        };
        this.getPlatformStatus = () => __awaiter(this, void 0, void 0, function* () {
            const url = `/platform/status`;
            const payload = {};
            return yield this._request(url, payload);
        });
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
}
exports.Bitfinex = Bitfinex;
