var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/auth');
const LoginMatch = require('../match/login');
const refreshToken = require('../match/refreshToken');

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}
// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username: username, password: hashedPassword });
        await newUser.save();
        console.log("✅ User saved!");
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Failed to register user.' });
    }
  });
  
// Authenticate a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = generateAccessToken({ username: req.body.username });
            LoginMatch()
            res.status(200).json({
                token: token,
                username: user.username,
                message: 'Login successful.'
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password.' });
        }
    } catch (err) {
        console.error('Error authenticating user:', err);
        res.status(500).json({ error: 'Failed to authenticate user.' });
    }
});

router.get('/refresh-token', authenticateJWT, async (req, res) => {
    const token = generateAccessToken({ username: req.user.username });
    refreshToken()
    res.status(200).json({
        token: token,
        username: req.user.username,
        message: 'Login successful.'
    });
})

module.exports = router;
