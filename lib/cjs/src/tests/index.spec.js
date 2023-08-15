"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const bitfinex = new src_1.Bitfinex();
describe("Platform Status", () => {
    it("should be able to check if Bitfinex is operational", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield bitfinex.getPlatformStatus()).toBeDefined();
    }));
});
describe("Ticker", () => {
    it("should show the specific ticket for a pair", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield bitfinex.getTicker("tBTCUSD")).toBeDefined();
    }));
});
