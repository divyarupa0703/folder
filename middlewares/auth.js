const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from the "Authorization" header
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = auth;