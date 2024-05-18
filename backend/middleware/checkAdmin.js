function checkAdmin(req, res, next) {
    if (req.userRole !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}

module.exports = { checkAdmin };
