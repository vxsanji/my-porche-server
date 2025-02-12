var express = require('express');
var router = express.Router();

router.post('/opened-position', async function(req, res, next) {
    let { tradingApiToken, system_uuid} = req.body
    let cookies = req.headers.cookie.split('; ').reduce((acc, c) => {
        let [key, value] = c.split('=');
        acc[key.trim()] = decodeURIComponent(value);
        return acc;
    }, {});
    var myHeaders = new Headers();
    myHeaders.append("Auth-trading-api", tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+cookies['co-auth']);
    

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        let response = await fetch(`https://mtr.e8markets.com/mtr-api/${system_uuid}/open-positions`, requestOptions)
        let result = await response.json();
        res.status(200).json(result.positions);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

router.post('/close-position', async function(req, res, next) {
    let { tradingApiToken, system_uuid} = req.query
    let position = req.body
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
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(position)
    };
    try {
        let response = await fetch(`https://mtr.e8markets.com/mtr-api/${system_uuid}/position/close`, requestOptions)
        let result = await response.json();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});


router.post('/open',async function(req, res, next) {
    const { 
        instrument,
        orderSide,
        volume,
        slPrice,
        tpPrice, 
    } = req.body;
    
    let { tradingApiToken, system_uuid} = req.query
    let cookies = req.headers.cookie.split('; ').reduce((acc, c) => {
        let [key, value] = c.split('=');
        acc[key.trim()] = decodeURIComponent(value);
        return acc;
    }, {});
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json"); 
    myHeaders.append("Auth-trading-api", tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+cookies['co-auth']);

    var raw = JSON.stringify({
        "instrument": instrument,
        "orderSide": orderSide,
        "volume": volume,
        "slPrice": slPrice,
        "tpPrice": tpPrice,
        "isMobile": false
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        let response = await fetch(`https://mtr.e8markets.com/mtr-api/${system_uuid}/position/open`, requestOptions)
        let result = await response.json();
        res.status(200).json({ message: 'Login successful', user: result });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
    
});

router.post('/edit',async function(req, res, next) {
    const { 
        instrument,
        id,
        orderSide,
        volume,
        slPrice,
        tpPrice,
    } = req.body;
    
    let { tradingApiToken, system_uuid} = req.query
    let cookies = req.headers.cookie.split('; ').reduce((acc, c) => {
        let [key, value] = c.split('=');
        acc[key.trim()] = decodeURIComponent(value);
        return acc;
    }, {});
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json"); 
    myHeaders.append("Auth-trading-api", tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+cookies['co-auth']);

    var raw = JSON.stringify({
        "instrument": instrument,
        "id": id,
        "orderSide": orderSide,
        "volume": volume,
        "slPrice": slPrice,
        "tpPrice": tpPrice,
        "isMobile": false
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        let response = await fetch(`https://mtr.e8markets.com/mtr-api/${system_uuid}/position/edit`, requestOptions)
        let result = await response.json();
        res.status(200).json({ message: 'Login successful', user: result });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
    
});

module.exports = router;
