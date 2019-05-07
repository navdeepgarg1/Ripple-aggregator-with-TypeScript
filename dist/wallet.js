"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const ripple_lib_1 = require("ripple-lib");
// var RippleAPI = require('ripple-lib').RippleAPI;
const api = new ripple_lib_1.RippleAPI({
    server: process.env.RIPPLE_IP
});
router.post("/balance", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const connection = yield api.connect();
        const response = yield api.getBalances(req.body.address);
        api.disconnect();
        res.status(200).send(response);
    }
    catch (error) {
        res.status(404).send(error);
    }
}));
router.post("/transaction/address", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const connection = yield api.connect();
        const response = yield api.getTransactions(req.body.address);
        api.disconnect();
        res.status(200).send(response);
    }
    catch (error) {
        res.status(404).send(error);
    }
}));
module.exports = router;
//# sourceMappingURL=wallet.js.map