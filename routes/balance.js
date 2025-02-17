var express = require('express');
var router = express.Router();
const TradingAccount = require('../models/tradingAccount');
const OnlineAccount = require('../models/onlineAccount');
router.get('/', async function(req, res, next) {
    const account = await OnlineAccount.findOne({id: req.query.id});
    const tradingAccount = await TradingAccount.findOne(req.query)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Auth-trading-api", tradingAccount.tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+account.coAuth);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };
    try {
        let response = await fetch(`${account.baseUrl}/mtr-api/${tradingAccount.offer.system.uuid}/balance`, requestOptions)
        let result = await response.json();
        if(result.balance){
            let vol = parseInt(result.balance) / 10000
            if(vol < 0.9) vol = 0.5
            else vol = Math.round(vol)
            const volume = await TradingAccount.findOneAndUpdate(req.query, {volume: parseFloat(vol).toFixed(2)})
            result.volume = parseFloat(vol).toFixed(2)
            volume.save()
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router;
