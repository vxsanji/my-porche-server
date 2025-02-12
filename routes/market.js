var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
    let { tradingApiToken, system_uuid, symbol} = req.query
    let cookies = req.headers.cookie.split('; ').reduce((acc, c) => {
        let [key, value] = c.split('=');
        acc[key.trim()] = decodeURIComponent(value);
        return acc;
    }, {});
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Auth-trading-api", tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+cookies['co-auth']);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };
    try {
        let response = await fetch(`https://mtr.e8markets.com/mtr-api/${system_uuid}/quotations?symbols=${symbol}`, requestOptions)
        let result = await response.json();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router;
