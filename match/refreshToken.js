const Account = require('../models/account');
const crypto = require('crypto');
const OnlineAccount = require('../models/onlineAccount');
const FilterAccount = require('../models/FilterAccount');

function getCookie(name, cookies) {
    const match = cookies.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}
async function refreshToken(){
    try {
        const accounts = await OnlineAccount.find();
        
        accounts.forEach(async function(account) {
            var myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "rt="+account.rt);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            };
            let response = await fetch(`${account.baseUrl}/manager/refresh-token`, requestOptions)
            const cookies = response.headers.get('Set-Cookie');
            const newCoAuth = await OnlineAccount.findByIdAndUpdate( account._id, {
                coAuth: getCookie('co-auth', cookies),
                rt: getCookie('rt', cookies),
            })
            newCoAuth.save()
            console.log("✅ Refresh Token success!");
        })
    } catch (error) {
        console.error('Error refreshing token:', err);
    }
}

module.exports = refreshToken;
