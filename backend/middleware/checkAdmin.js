function checkAdmin(req, res, next) {
    if (req.userRole !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Admin privilege required' });
    }
    next();
}

module.exports = { checkAdmin };
