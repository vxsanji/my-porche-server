const mongoose = require("mongoose");

const Blocked = new mongoose.Schema({
    tradingAccountId: { type: String, required: true },
});

module.exports = mongoose.model("Blocked", Blocked);
