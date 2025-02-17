const mongoose = require("mongoose");

const Token = new mongoose.Schema({
    token: String,
    expiration: String
})

const TradingAccountSchema = new mongoose.Schema({
    id: { type:String, required: true },
    tradingAccountId: { type: String, required: true },
    tradingApiToken: { type: String, required: true },
    tradingAccountToken: [Token],
    isActive: { type: Boolean, required: true },
    volume: { type: Number, required: true },
    offer: new mongoose.Schema({
        name: String,
        system: new mongoose.Schema({
            uuid: String,
        })
    })
})

const TradingAccount = mongoose.model("TradingAccount", TradingAccountSchema);
module.exports = TradingAccount;
