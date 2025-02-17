const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    baseUrl: { type: String, required: true },
    brokerId: { type: String, required: true},
    password: { type: String, required: true }
});

const Account = mongoose.model("Account", AccountSchema);
module.exports = Account;
