import express from 'express';
import Child from '../models/Child.js';

const router = express.Router();

const createChild = async(req, res) => {
  try{
    let { name, avatar, age, timeLimit, usageTime, lastLoginAt, progress } = req.body;

    const child = await Child.create({
      name,
      avatar,
      age,
      timeLimit,
      usageTime,
      lastLoginAt,
      progress: {
        categoryId: progress.categoryId,
        completedAt: progress.completedAt,
        badge: progress.badge,
      }
    });

    res.status(201).json(child);

  }catch(error){
    res.status(500).json({error: error.message});
  }
};


router.post("/test-child", createChild);
export default router;