const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('⚠️ Auth Middleware: Missing or malformed token');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
        req.user = decoded;
        
        // Dynamic Access Control for Assistant HOD
        if (req.user.role === 'Assistant HOD') {
            const SystemConfig = require('../models/SystemConfig');
            const config = await SystemConfig.findOne({ key: 'assistant_hod_access' });
            if (config && config.value === false) {
                return res.status(403).json({ message: 'Access Denied: Assistant HOD services are currently offline.' });
            }
        }

        next();
    } catch (err) {
        console.error('❌ Auth Middleware Error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Unauthorized role' });
        }
        next();
    };
};

module.exports = { auth, checkRole };
