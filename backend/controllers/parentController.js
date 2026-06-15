import Child from '../models/Child.js';
import Parent from '../models/Parent.js';

//get one parent information
const getParent = async(req, res) => {
  try{
    const parent = await Parent.findById(req.params.id).populate('childId');

    console.log("GET PARENT POPULATED =", parent.childId);
    
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
    const {name, email, password, notification} = req.body;
    const updateData = {name, email, notification};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (notification !== undefined) updateData.notification = notification;

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (notification !== undefined) {
      updateData.notification = notification;
    }

    // need to apply bcryptjs for password hash
    if(password){
      updateData.password = await bcrypt.hash(password, 10);
    }

    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      updateData,
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

    // delete child account connected to parent account
    if(parent.childId.length > 0){
      await Child.deleteMany({_id: {$in: parent.childId}});
    }

    res.status(200).json({message: "account deleted"})
  }catch(error){
    res.status(500).json({ error: error.message });
  };
}

export {getParent, createParent, editParent, deleteParent};