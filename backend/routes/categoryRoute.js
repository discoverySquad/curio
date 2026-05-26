console.log('categoryRoute loaded');
import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

const createCategory = async(req, res) => {
  try{

    let {categoryName, categoryItem, activityInstruction} = req.body;

    const category = await Category.create({
      categoryName,
      categoryItem,
      activityInstruction,
    })
  
  res.status(201).json()

  }catch(error){
    res.status(500).json({error: error.message});
  }
}

router.post("/test-category", createCategory);
export default router;