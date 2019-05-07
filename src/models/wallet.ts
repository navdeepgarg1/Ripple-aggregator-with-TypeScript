import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    address: String,
    balance: String,
    createdAT : { type: Date, default: Date.now()}
});

export default mongoose.model("wallet", userSchema);
