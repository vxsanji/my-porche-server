var express = require('express');
const TradingAccount = require('../models/tradingAccount');
const OnlineAccount = require('../models/onlineAccount');
var router = express.Router();

router.get('/opened-position', async function(req, res, next) {
    var myHeaders = new Headers();
    const account = await OnlineAccount.findOne({id: req.query.id})
    const tradeAccount = await TradingAccount.findOne(req.query)
    const system_uuid = tradeAccount.offer.system.uuid
    myHeaders.append("Content-Type", "application/json"); 
    myHeaders.append("Auth-trading-api", tradeAccount.tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+account.coAuth);
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        let response = await fetch(`${account.baseUrl}/mtr-api/${system_uuid}/open-positions`, requestOptions)
        let result = await response.json();
        res.status(200).json(result.positions);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

router.post('/close', async function(req, res, next) {
    var myHeaders = new Headers();
    const account = await OnlineAccount.findOne({id: req.query.id})
    const tradeAccount = await TradingAccount.findOne(req.query)
    const system_uuid = tradeAccount.offer.system.uuid
    myHeaders.append("Content-Type", "application/json"); 
    myHeaders.append("Auth-trading-api", tradeAccount.tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+account.coAuth);
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(req.body)
    };
    try {
        let response = await fetch(`${account.baseUrl}/mtr-api/${system_uuid}/position/close`, requestOptions)
        let result = await response.json();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});


router.post('/open',async function(req, res, next) {
    var myHeaders = new Headers();
    const account = await OnlineAccount.findOne({id: req.query.id})
    const tradeAccount = await TradingAccount.findOne(req.query)
    const system_uuid = tradeAccount.offer.system.uuid
    myHeaders.append("Content-Type", "application/json"); 
    myHeaders.append("Auth-trading-api", tradeAccount.tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+account.coAuth);
    req.body.volume = (req.body.volume * tradeAccount.volume).toFixed(2)
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(req.body),
        redirect: 'follow'
    };

    try {
        let response = await fetch(`${account.baseUrl}/mtr-api/${system_uuid}/position/open`, requestOptions)
        let result = await response.json();
        res.status(200).json({ message: 'Login successful', user: result });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
    
});

router.post('/edit',async function(req, res, next) {    
    var myHeaders = new Headers();
    const account = await OnlineAccount.findOne({id: req.query.id})
    const tradeAccount = await TradingAccount.findOne(req.query)
    const system_uuid = tradeAccount.offer.system.uuid
    myHeaders.append("Content-Type", "application/json"); 
    myHeaders.append("Auth-trading-api", tradeAccount.tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+account.coAuth);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(req.body),
        redirect: 'follow'
    };

    try {
        let response = await fetch(`${account.baseUrl}/mtr-api/${system_uuid}/position/edit`, requestOptions)
        let result = await response.json();
        res.status(200).json({ message: 'Login successful', user: result });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
    
});

module.exports = router;
