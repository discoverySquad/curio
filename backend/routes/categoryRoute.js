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
  
  res.status(201).json(category)

  }catch(error){
    res.status(500).json({error: error.message});
  }
}

const getCategoryByName = async(req, res) => {
  try{
    const category = await Category.findOne({ 
      categoryName: { $regex: new RegExp(`^${req.params.name}$`, 'i') }
    });
    if(!category){
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  }catch(error){
    res.status(500).json({error: error.message});
  }
};

router.post("/category", createCategory);
router.get("/name/:name", getCategoryByName);

export default router;