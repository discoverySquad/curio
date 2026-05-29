import Child from '../models/Child.js';
import Parent from '../models/Parent.js';

//get one child information
const getChild = async(req, res) => {
  try{
    const child = await Child.findById(req.params.id);
    if(!child){
      return res.status(404).json({message: "Child not found"})
    }
    res.json(child);
  }catch(error){
    res.status(500).json({ error: error.message});
  };
}

// create child information
const createChild = async(req, res) => {
  try{
    let { name, avatar, age, timeLimit, usageTime, lastLoginAt, progress, parentMongoId } = req.body;

    const parent = await Parent.findById(parentMongoId);
    if(!parent){
      return res.status(404).json({message: "Parent not found"});
    }

    const child = await Child.create({
      name,
      avatar,
      age,
      timeLimit,
      usageTime,
      lastLoginAt,
      progress: progress || []
    });

    await Parent.findByIdAndUpdate(
      parentMongoId,
      { $push: { childId: child._id}},
      {new:true}
    );

    res.status(201).json(child);

  }catch(error){
    res.status(500).json({error: error.message});
  }
};

//edit child account
const editChild = async(req, res) => {
  try{

    const {name, avatar, age, timeLimit } = req.body;
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      {name, avatar, age, timeLimit },
      {new: true}
    );
    
    if(!child){
      return res.status(404).json({message: "Child not found"});
    }

    res.status(200).json(child);

  }catch(error){
    res.status(500).json({error: error.message});
  }
}

//delete child account
const deleteChild = async(req, res) => {
  try{
  const child = await Child.findByIdAndDelete(req.params.id);
  if(!child){
    return res.status(404).json({ message: "Child not found"});
  }    
    res.status(200).json({message: "Account deleted"});
  }catch(error){
    res.status(500).json({ error: error.message});
  }
}

export {createChild, getChild, editChild, deleteChild};