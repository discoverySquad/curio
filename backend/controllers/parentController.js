import bcrypt from 'bcryptjs';

import Child from '../models/Child.js';
import Parent from '../models/Parent.js';

//get one parent information
const getParent = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).select('-password').populate('childId');

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    console.log("GET PARENT POPULATED =", parent.childId);

    res.json(parent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create parent account
const createParent = async (req, res) => {
  try {

    let { name, email, password, notification } = req.body;

    const parent = await Parent.create({
      name,
      email,
      password,
      notification
    });

    res.status(201).json(parent);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getParentChildren = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate('childId');

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    res.status(200).json(parent.childId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createParent = async (req, res) => {
  try {
    const { name, email, password, notification } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existingParent = await Parent.findOne({ email });

    if (existingParent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const parent = await Parent.create({
      name,
      email,
      password: hashedPassword,
      notification,
    });

    res.status(201).json({
      id: parent._id,
      name: parent.name,
      email: parent.email,
      childId: parent.childId,
      notification: parent.notification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editParent = async (req, res) => {
  try {
    const { name, email, password, notification } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (notification !== undefined) updateData.notification = notification;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const parent = await Parent.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    res.status(200).json(parent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndDelete(req.params.id);

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    await Child.deleteMany({ _id: { $in: parent.childId || [] } });

    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getParent, getParentChildren, createParent, editParent, deleteParent };
