import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/test-user', async (req, res) => {
  try {
    const user = await User.create({
      fullName: 'Test User',
      email: `test${Date.now()}@test.com`,
      password: '123456',
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/test-user', async (req, res) => {
  try {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@test.com',
      password: '123456',
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;