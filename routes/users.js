var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', async function(req, res, next) {
    let { tradingApiToken, system_uuid} = req.body
    if(!req.headers.cookie) return res.status(400).json({ message: 'Cookie not found' });
    let cookies = req.headers.cookie.split('; ').reduce((acc, c) => {
        let [key, value] = c.split('=');
        acc[key.trim()] = decodeURIComponent(value);
        return acc;
    }, {});
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Auth-trading-api", tradingApiToken);
    myHeaders.append("Cookie", "co-auth="+cookies['co-auth']);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        let response = await fetch(`https://mtr.e8markets.com/mtr-api/${system_uuid}/balance`, requestOptions)
        let result = await response.json();
        if(result.balance){
            res.status(200).json(result);
            return;
        }
        if(result.status != 200) {
            res.status(result.status).json(result)
        }else{
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router;
