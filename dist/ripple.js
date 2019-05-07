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
const request_1 = __importDefault(require("request"));
const transaction_1 = __importDefault(require("./models/transaction"));
const wallet_1 = __importDefault(require("./models/wallet"));
api.on("error", (errorCode, errorMessage) => {
    // tslint:disable-next-line:no-console
    console.log(errorCode + ": " + errorMessage);
});
api.on("connected", () => {
    // tslint:disable-next-line:no-console
    console.log("Connecting To Ripple Network");
});
api.on("disconnected", (code) => {
    // tslint:disable-next-line:no-console
    console.log("Breaking Connection from Ripple Network");
});
router.post("/balance", (req, res) => __awaiter(this, void 0, void 0, function* () {
    wallet_1.default.find({ address: req.body.address })
        .then((data) => __awaiter(this, void 0, void 0, function* () {
        if (data.length > 0) {
            // tslint:disable-next-line:no-console
            console.log("ddd", data);
            res.status(200).send(data);
        }
        else {
            try {
                const connection = yield api.connect();
                const response = yield api.getBalances(req.body.address);
                api.disconnect();
                const obj = {
                    address: req.body.address,
                    balance: response[0].value
                };
                // tslint:disable-next-line:no-console
                console.log(response);
                wallet_1.default.create(obj).then((result) => {
                    res.status(200).send(result);
                });
            }
            catch (error) {
                res.status(404).send(error);
            }
        }
    }))
        .catch((e) => res.status(400).send(e));
}));
router.post("/transaction/address", (req, res) => __awaiter(this, void 0, void 0, function* () {
    transaction_1.default
        .find({ address: req.body.address })
        .then((data) => __awaiter(this, void 0, void 0, function* () {
        if (data.length > 0) {
            res.status(200).send(data);
        }
        else {
            const query = `https://data.ripple.com/v2/accounts/${req.body.address}/transactions?type=Payment&result=tesSUCCESS`;
            yield request_1.default(query, (err, resp) => {
                if (err) {
                    res.send(err);
                }
                else {
                    // tslint:disable-next-line:no-console
                    console.log(JSON.parse(resp.body).transactions);
                    const obj = {
                        address: req.body.address,
                        transaction_details: JSON.parse(resp.body).transactions
                    };
                    transaction_1.default.create(obj).then((result) => {
                        res.status(200).send(result);
                    });
                }
            });
        }
    }))
        .catch((e) => res.status(400).send(e));
}));
router.post("/getMonthlyIncome", (req, res) => __awaiter(this, void 0, void 0, function* () {
    transaction_1.default
        .aggregate([
        {
            $unwind: "$transaction_details"
        },
        {
            $group: {
                _id: {
                    _id: "$_id",
                    address: "$address"
                },
                trans: {
                    $first: "$transaction_details"
                }
            }
        },
        {
            $group: {
                _id: "$trans.tx"
            }
        }
    ])
        .then((data) => res.send(data))
        .catch((e) => res.send(e));
}));
exports.default = router;
//# sourceMappingURL=ripple.js.map