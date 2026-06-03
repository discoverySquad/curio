import Child from '../models/Child.js';
import Parent from '../models/Parent.js';

//get one child information
const getChild = async(req, res) => {
  try{
    const child = await Child.findById(req.params.id);
    if(!child){
      return res.status(404).json({message: "Child not found"})
    }

    // if lastLogin is before today, reset usageTimeToday
    const today = new Date().toDateString();
    const lastLogin = new Date(child.lastLoginAt).toDateString();

    if(today !== lastLogin){
      child.usageTimeToday = 0;
      child.lastLoginAt = new Date();
      await child.save();
    }

    res.json(child);
  }catch(error){
    res.status(500).json({ error: error.message});
  };
}

// create child information
const createChild = async(req, res) => {
  try{
    let { name, avatar, age, timeLimit, usageTimeToday, lastLoginAt, parentId } = req.body;

    const child = await Child.create({
      name,
      avatar,
      age,
      timeLimit,
      usageTimeToday,
      lastLoginAt,
    });

    await Parent.findByIdAndUpdate(
      parentId,
      { $push: { childId: child._id}}
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

// save usage time
const saveUsageTime = async(req, res) => {
  try{
    const { usageTimeToday } = req.body;
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      {$set: {usageTimeToday} },
      { new: true }
    );

    if(!child) {
      return res.status(404).json({message: "Child not found"});
    }

    res.status(200).json(child);
  }catch(error){
    res.status(500).json({ error: error.message});
  }
}

//delete child account
const deleteChild = async(req, res) => {
  try{
  const child = await Child.findByIdAndDelete(req.params.id);
  if(!child){
    return res.status(404).json({ message: "Child not found"});
  }    
    // delete children id from parent collection
    await Parent.updateMany(
      {childId: req.params.id},
      {$pull: {childId: req.params.id}}
    );
    
    res.status(200).json({message: "Account deleted"});
  }catch(error){
    res.status(500).json({ error: error.message});
  }
}

export {createChild, getChild, editChild, deleteChild, saveUsageTime};