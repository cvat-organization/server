const jwt = require('jsonwebtoken');

const sessions = require('../models/sessions');
const config = require('../config/config');
const secretKey = config.jwtSecret;

async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];

        // Check if token is present in request header
        if (!token)
            return res.status(400).json({message: 'Token missing'});

        // Verify the token
        const decodedToken = jwt.verify(token, secretKey);

        // Check if a session is open using the token
        const session = await sessions.findOne({ token });
        if (!session || !session.isActive)
            return res.status(404).json({message: 'Session not found'});

        // Attach the decoded token and sessionID to the request object for later use
        req.decodedToken = decodedToken;
        req.sessionID = session._id;

        next();
    } catch (err) {
        // Error handling
        res.status(401).json({message: err.message});
    }
}

module.exports = authMiddleware;
