import express from 'express';
import Parent from '../models/Parent.js';

const router = express.Router();

const createParent = async(req, res) => {
  try{

    let { name, email, password, childId, notification} = req.body;

      const parent = await Parent.create({
        name,
        email,
        password,
        childId,
        notification
      });

      res.status(201).json(parent);

  }catch(error){
    res.status(500).json({error: error.message});
  }
};

router.post("/parent", createParent);
export default router;