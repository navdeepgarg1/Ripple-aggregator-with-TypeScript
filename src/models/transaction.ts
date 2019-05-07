import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    address: String,
    createdAT : { type: Date, default: Date.now()},
    transaction_details: [],

});

export default mongoose.model("transaction", transactionSchema);
