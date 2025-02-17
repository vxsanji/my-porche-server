var express = require('express');
const Account = require('../models/account');
const OnlineAccount = require('../models/onlineAccount');
const FilterAccount = require('../models/filterAccount');
const TradingAccount = require('../models/tradingAccount');
const Blocked = require('../models/blocked');
var router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const user = await Account.find();
        res.status(200).json({
            data : user,
            message: "Get account successfully"
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
});

router.post('/', async function(req, res, next) {
    if (!req.body.email ||!req.body.password || !req.body.name) {
        return res.status(400).json({ message: 'Missing some required form' });
    }
    try {
        const user = new Account({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            brokerId: req.body.brokerId,
            baseUrl: req.body.baseUrl
        });
        user.save();
        res.status(201).json({ message: 'Account created successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

router.get('/all', async function(req, res, next) {
    try {
        let accounts = await OnlineAccount.find();
        accounts = await Promise.all(accounts.map(async acc => {
            let tradingAccount = await TradingAccount.find({ id: acc.id });
            return {
                id: acc.id,
                name: acc.name,
                tradingAccounts: tradingAccount.filter( ta => ta.isActive === true)
                    .map(ta => {
                        return {
                            tradingAccountId: ta.tradingAccountId,
                            name: ta.offer.name,
                            isActive: null
                        };
                    })
            };
        }));
        res.status(200).json({
            data: accounts,
            message: "Get account successfully"
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
});

router.get('/all-unfiltered', async function(req, res, next) {
    try {
        let accounts = await OnlineAccount.find();
        accounts = await Promise.all(accounts.map(async acc => {
            let tradingAccount = await TradingAccount.find({ id: acc.id });
            return {
                id: acc.id,
                name: acc.name,
                tradingAccounts: tradingAccount.map(ta => {
                        return {
                            tradingAccountId: ta.tradingAccountId,
                            name: ta.offer.name,
                            isActive: ta.isActive
                        };
                    })
            };
        }));
        res.status(200).json({
            data: accounts,
            message: "Get account successfully"
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
});

router.get('/deactivated', async (req, res) => {
    try {
        const deactivated = await FilterAccount.find()
        res.status(200).json({
            data: deactivated,
            message: 'Get deactivated accounts successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving deactivated accounts', error: error.message });
    }
})

router.post('/deactivate', async (req, res) => {
    try {
        const filterAccount = new FilterAccount(req.body)
        const tradingAccount = await TradingAccount.findOneAndUpdate(req.body, {isActive: false})
        await filterAccount.save()
        await tradingAccount.save()
        res.status(200).json({ message: 'Account deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating account', error: error.message });
    }
})

router.delete('/deactivate', async (req, res) => {
    try {
        await FilterAccount.findOneAndDelete(req.query)
        const tradingAccount = await TradingAccount.findOneAndUpdate(req.body, {isActive: true})
        await tradingAccount.save()
        res.status(200).json({ message: 'Account reactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error reactivating account', error: error.message });
    }
})

router.post('/block', async (req, res) => {
    try {
        const block = new Blocked(req.body)
        await block.save()
        res.status(200).json({ message: 'Account Blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error blocking account', error: error.message });
    }
})

module.exports = router;
