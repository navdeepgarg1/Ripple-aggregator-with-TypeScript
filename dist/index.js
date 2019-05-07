"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// require('dotenv').config();
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = express_1.default();
dotenv_1.default.config();
const port = process.env.SERVER_PORT; // default port to listen
const ripple_1 = __importDefault(require("./ripple"));
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.use("/api", ripple_1.default);
const db = "mongodb://localhost:27017/test1";
mongoose_1.default.connect(db, { useCreateIndex: true, useNewUrlParser: true })
    .then((res) => {
    // tslint:disable-next-line:no-console
    console.log("***CONGRATS FOR MongoDB CONNECTION***");
})
    .catch((err) => {
    // tslint:disable-next-line:no-console
    console.error("***DATABASE NOT CONNECTED***");
});
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map