var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/',async function(req, res, next) {
    const { email, password } = req.body;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "email": email,
        "password": password,
        "brokerId": "2"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    try {
        let response = await fetch("https://mtr.e8markets.com/mtr-backend/login", requestOptions)
        const cookies = response.headers.get('Set-Cookie');
        
        function getCookie(name) {
            const match = cookies.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : null;
        }
        let result = await response.json();
        const expires = new Date(Date.now() + 60 * 60 * 1000)
        res.cookie("co-auth", getCookie('co-auth'), {
            path:'/',
            httpOnly: true,
            expires: expires,
            sameSite: true,
            // domain:'localhost',
        })
        res.cookie("rt", getCookie('rt'), {
            path:'/',
            httpOnly: true,
            expires: expires,
            sameSite: true,
            // domain:'localhost',
        })
        let user = {
            email: result.email,
            token: result.token,
            tradingAccounts: result.tradingAccounts
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
    
});

module.exports = router;
