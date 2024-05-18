const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require("../common/prismaClient");

const saltRounds = 10;

async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function createUser(req, res) {
    const { name, email, password, role } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (role && !['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER',
            }
        });
        res.status(200).json(user);
    } catch (error) {
        if (error.code === 'P2002' && error.meta && error.meta.target.includes('email')) {
            res.status(400).json({ message: 'Email already in use' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function getUserById(req, res) {
    const { id } = req.params;

    if (req.userRole !== 'ADMIN' && req.userId !== Number(id)) {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function updateUser(req, res) {
    const { id } = req.params;

    if (req.userRole !== 'ADMIN' && req.userId !== Number(id)) {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const data = {};

        if (req.body.name) {
            data.name = req.body.name;
        }
        if (req.body.email) {
            data.email = req.body.email;
        }
        if (req.body.password) {
            data.password = await hashPassword(req.body.password);
        }

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data
        });

        res.status(200).json(user);
    } catch (error) {
        if (error.code === 'P2002' && error.meta && error.meta.target.includes('email')) {
            res.status(400).json({ message: 'Email already in use' });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    if (req.userRole !== 'ADMIN' && req.userId !== Number(id)) {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const user = await prisma.user.delete({
            where: { id: Number(id) }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
