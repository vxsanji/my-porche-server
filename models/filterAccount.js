const mongoose = require("mongoose");

const filterAccount = new mongoose.Schema({
    id: { type: String, required: true },
    tradingAccountId: { type: String, required: true },
});

module.exports = mongoose.model("FilterAccount", filterAccount);
