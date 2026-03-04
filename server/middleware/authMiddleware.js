const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        req.adminId = decoded.id; // backward compatibility
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
