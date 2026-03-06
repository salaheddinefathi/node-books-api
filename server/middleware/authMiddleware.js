const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        req.adminId = decoded.id;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.name, error.message);
        const status = error.name === 'TokenExpiredError' ? 401 : 401;
        res.status(status).json({
            message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
            error: error.message
        });
    }
};

module.exports = authMiddleware;
