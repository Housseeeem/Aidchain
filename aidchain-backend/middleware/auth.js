const jwt = require('jsonwebtoken');

/**
 * Authentication middleware - Verifies JWT token
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function auth(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided.' 
            });
        }

        // Extract token (format: "Bearer <token>")
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Access denied. Invalid token format.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info to request
        req.user = decoded;
        
        next();
        
    } catch (err) {
        console.error('Authentication error:', err.message);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token has expired. Please login again.' 
            });
        }
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Invalid token. Please login again.' 
            });
        }
        
        return res.status(401).json({ 
            error: 'Authentication failed.' 
        });
    }
}

module.exports = auth;
