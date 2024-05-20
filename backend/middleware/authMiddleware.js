const jwt = require('jsonwebtoken');
const prisma = require('../common/prismaClient');
const jwtSecret = process.env.JWT_SECRET || 'default_secret';

async function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.userId = decoded.userId;
        req.userRole = user.role;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = { verifyToken };
