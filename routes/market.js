var express = require('express');
const OnlineAccount = require('../models/onlineAccount');
const TradingAccount = require('../models/tradingAccount');
var router = express.Router();

router.get('/', async function(req, res, next) {
    const symbol = req.query.symbol;
    var myHeaders = new Headers();
    const account = await OnlineAccount.find()
    const tradeAccount = await TradingAccount.find()
    const system_uuid = tradeAccount[0].offer.system.uuid
    myHeaders.append("Content-Type", "application/json"); 
    myHeaders.append("Auth-trading-api", tradeAccount[0].tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+account[0].coAuth);
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        let response = await fetch(`${account[0].baseUrl}/mtr-api/${system_uuid}/quotations?symbols=${symbol}`, requestOptions)
        let result = await response.json();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router;
