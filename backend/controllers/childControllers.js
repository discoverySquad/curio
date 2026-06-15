import mongoose from 'mongoose';
import Child from '../models/Child.js';
import Parent from '../models/Parent.js';

//get one child information
const getChild = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" })
    }

    // if lastLogin is before today, reset usageTimeToday
    const today = new Date().toDateString();
    const lastLogin = child.lastLoginAt ? new Date(child.lastLoginAt).toDateString() : null;

    if (today !== lastLogin) {
      // Use findByIdAndUpdate to avoid validation errors
      await Child.findByIdAndUpdate(
        req.params.id,
        {
          usageTimeToday: 0,
          lastLoginAt: new Date()
        },
        { new: true }
      );
    }

    // Fetch the updated child
    const updatedChild = await Child.findById(req.params.id);
    res.json(updatedChild);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
}

// create child information
const createChild = async (req, res) => {
  try {
    let { name, avatar, grade, timeLimit, usageTimeToday, lastLoginAt, parentId } = req.body;
    console.log("REQ BODY:", req.body);
    console.log("PARENT ID:", parentId);
    const child = await Child.create({
      name,
      avatar,
      grade,
      timeLimit,
      usageTimeToday,
      lastLoginAt,
    });

    if (!parentId) {
      console.log("NO parentId, skipping parent update");
    } else {
      await Parent.findByIdAndUpdate(
        parentId,
        // avoid duplicate
        { $addToSet: { childId: child._id } }
      );
    }

    res.status(201).json(child);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//edit child account
const editChild = async (req, res) => {
  try {

    const { name, avatar, grade, timeLimit } = req.body;
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      { name, avatar, grade, timeLimit },
      { new: true }
    );

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.status(200).json(child);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// save usage time
const saveUsageTime = async (req, res) => {
  try {
    const { usageTimeToday } = req.body;
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      { $set: { usageTimeToday } },
      { new: true }
    );

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.status(200).json(child);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//delete child account
const deleteChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }
    // delete children id from parent collection
    await Parent.updateMany(
      { childId: req.params.id },
      { $pull: { childId: new mongoose.Types.ObjectId(req.params.id) } }
    );

    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { createChild, getChild, editChild, deleteChild, saveUsageTime };