const jwt = require("jsonwebtoken");

// Middleware function to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization"); // Get token from headers
    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const secretKey = process.env.TOKEN_SECRET
        const verified = jwt.verify(token.replace("Bearer ", ""), secretKey); // Verify JWT
        req.user = verified; // Attach user data to request object
        next(); // Proceed to next middleware/controller
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authenticateJWT;
