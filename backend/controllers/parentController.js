import Parent from '../models/Parent.js';

//get one parent information
const getParent = async(req, res) => {
  try{
    const parent = await Parent.findById(req.params.id);
    if(!parent){
      return res.status(404).json({message: "Parent not found"});
    }
    res.json(parent)
  }catch(error){
    res.status(500).json({error: error.message})
  }
}

// create parent account
const createParent = async(req, res) => {
  try{

    let { name, email, password, notification} = req.body;

      const parent = await Parent.create({
        name,
        email,
        password,
        notification
      });

      res.status(201).json(parent);

  }catch(error){
    res.status(500).json({error: error.message});
  }
};

// edit parent account
const editParent = async(req, res) => {
  try{
    const {name, email, password} = req.body;
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      {name, email, password},
      {new: true}
    );

    if(!parent){
      return res.status(404).json({ error: "Parent not found"});
    }

    res.status(200).json(parent);
  }catch(error){
    res.status(500).json({ error: error.message });
  };
}

// delete account
const deleteParent = async(req, res) => {
  try{
    const parent = await Parent.findByIdAndDelete(req.params.id);
    if(!parent){
      return res.status(404).json({error: "Parent not found"});
    }

    res.status(200).json({message: "account deleted"})
  }catch(error){
    res.status(500).json({ error: error.message });
  };
}

export {getParent, createParent, editParent, deleteParent};