const Account = require('../models/account');
const crypto = require('crypto');
const OnlineAccount = require('../models/onlineAccount');
const TradingAccount = require('../models/tradingAccount');
const FilterAccount = require('../models/filterAccount');
const Blocked = require('../models/blocked');

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
function getCookie(name, cookies) {
    const match = cookies.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

async function LoginMatch(){
    try {
        await OnlineAccount.deleteMany()
        await TradingAccount.deleteMany()
        await FilterAccount.deleteMany()
        const accounts = await Account.find();
        const blocked = await Blocked.find();
        const blockedIds = blocked.map(acc => acc.tradingAccountId);
        const deactivatedAccounts = await FilterAccount.find()
        const deactivatedIds = deactivatedAccounts.map(acc => acc.tradingAccountId);
        accounts.forEach(async function(account) {
            const uuid = crypto.randomUUID()
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    "email": account.email,
                    "password": account.password,
                    "brokerId": account.brokerId,
                }),
                redirect: 'follow'
            };
            let response = await fetch(`${account.baseUrl}/mtr-backend/login`, requestOptions)
            let res = await response.json();
            const cookies = response.headers.get('Set-Cookie');
            const onlineAccounts = new OnlineAccount({
                id: uuid,
                name: account.name,
                coAuth: getCookie('co-auth', cookies),
                rt: getCookie('rt', cookies),
                token: res.token,
                email: res.email,
                baseUrl: account.baseUrl,
            })
            res.tradingAccounts
            .filter(account => !blockedIds.includes(account.tradingAccountId))
            .forEach( account => {
                account.id = uuid
                account.isActive = !deactivatedIds.includes(account.tradingAccountId)
                account.volume = 1
                const tradingAccount = new TradingAccount(account)
                tradingAccount.save()
            })
            onlineAccounts.save()
            console.log("✅ Login trading account success!");
        })
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

module.exports = LoginMatch;
