import jwt from 'jsonwebtoken';


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if token exists and starts with 'Bearer'
    const token = authHeader && authHeader.split( ' ' )[ 1 ];
    
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;