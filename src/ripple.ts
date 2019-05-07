import express from "express";
const router = express.Router();
import { RippleAPI } from "ripple-lib";
// var RippleAPI = require('ripple-lib').RippleAPI;
const api = new RippleAPI({
  server: process.env.RIPPLE_IP
});
import request from "request";
import transaction from "./models/transaction";
import wallet from "./models/wallet";

api.on("error", (errorCode, errorMessage) => {
      // tslint:disable-next-line:no-console
  console.log(errorCode + ": " + errorMessage);
});
api.on("connected", () => {
      // tslint:disable-next-line:no-console
  console.log("Connecting To Ripple Network");
});
api.on("disconnected", (code: any) => {
      // tslint:disable-next-line:no-console
  console.log("Breaking Connection from Ripple Network");
});

router.post("/balance", async (req: any , res) => {
  wallet.find({ address: req.body.address })
    .then(async (data: any) => {
      if (data.length > 0) {
            // tslint:disable-next-line:no-console
        console.log("ddd", data);
        res.status(200).send(data);
      } else {
        try {
          const connection = await api.connect();
          const response = await api.getBalances(req.body.address);
          api.disconnect();
          const obj = {
            address: req.body.address,
            balance: response[0].value
          };
            // tslint:disable-next-line:no-console
          console.log(response);
          wallet.create(obj).then((result: any) => {
            res.status(200).send(result);
          });
        } catch (error) {
          res.status(404).send(error);
        }
      }
    })
    .catch((e: any) => res.status(400).send(e));
});

router.post("/transaction/address", async (req, res) => {
  transaction
    .find({ address: req.body.address })
    .then(async (data: any) => {
      if (data.length > 0) {
        res.status(200).send(data);
      } else {
        const query = `https://data.ripple.com/v2/accounts/${req.body.address
}/transactions?type=Payment&result=tesSUCCESS`;
        await request(query, (err: any, resp: any) => {
          if (err) {
            res.send(err);
          } else {
                // tslint:disable-next-line:no-console
            console.log(JSON.parse(resp.body).transactions);
            const obj = {
              address: req.body.address,
              transaction_details: JSON.parse(resp.body).transactions
            };
            transaction.create(obj).then((result: any) => {
              res.status(200).send(result);
            });
          }
        });
      }
    })
    .catch((e: any) => res.status(400).send(e));
});

router.post("/getMonthlyIncome", async (req, res) => {
  transaction
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
    .then((data: any) => res.send(data))
    .catch((e: any) => res.send(e));
});

export default router;
