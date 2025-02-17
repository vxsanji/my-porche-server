const mongoose = require("mongoose");

const onlineAccountSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    coAuth: { type: String, required: true },
    rt: { type: String, required: true },
    token: { type: String, required: true},
    email: { type: String, required: true },
    baseUrl: { type: String, required: true },
});

const OnlineAccount = mongoose.model("OnlineAccount", onlineAccountSchema);
module.exports = OnlineAccount;
