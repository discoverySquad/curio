import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Parent from '../models/Parent.js';

const router = express.Router();

const createToken = (parentId) => {
    return jwt.sign({ parentId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
    try {
        const { fullName, name, email, password } = req.body;
        const parentName = fullName || name;

        if (!parentName || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const existingParent = await Parent.findOne({ email });

        if (existingParent) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const parent = await Parent.create({
            name: parentName,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'Account created successfully',
            token: createToken(parent._id),
            user: {
                id: parent._id,
                name: parent.name,
                fullName: parent.name,
                email: parent.email,
                childId: parent.childId,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const parent = await Parent.findOne({ email });

        if (!parent) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const passwordMatches = await bcrypt.compare(password, parent.password);

        if (!passwordMatches) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            token: createToken(parent._id),
            user: {
                id: parent._id,
                name: parent.name,
                fullName: parent.name,
                email: parent.email,
                childId: parent.childId,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
