import Child from '../models/Child.js';
import Parent from '../models/Parent.js';

const getChild = async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);

        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        const today = new Date().toDateString();
        const lastLogin = child.lastLoginAt ? new Date(child.lastLoginAt).toDateString() : null;

        if (today !== lastLogin) {
            await Child.findByIdAndUpdate(req.params.id, {
                usageTimeToday: 0,
                lastLoginAt: new Date(),
            });
        }

        const updatedChild = await Child.findById(req.params.id);
        res.json(updatedChild);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createChild = async (req, res) => {
    try {
        const { parentId, name, avatar, grade, timeLimit } = req.body;

        if (!parentId || !name || !grade) {
            return res.status(400).json({
                message: 'Parent ID, child name, and grade are required',
            });
        }

        const parent = await Parent.findById(parentId);

        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        const child = await Child.create({
            name,
            avatar,
            grade,
            timeLimit,
        });

        await Parent.findByIdAndUpdate(parentId, {
            $addToSet: { childId: child._id },
        });

        res.status(201).json(child);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editChild = async (req, res) => {
    try {
        const { name, avatar, grade, timeLimit } = req.body;

        const updateData = {};

        if (name) updateData.name = name;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (grade !== undefined) updateData.grade = grade;
        if (timeLimit !== undefined) updateData.timeLimit = timeLimit;

        const child = await Child.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        res.status(200).json(child);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const saveUsageTime = async (req, res) => {
    try {
        const { usageTimeToday } = req.body;

        const child = await Child.findByIdAndUpdate(req.params.id, { $set: { usageTimeToday } }, { new: true });

        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        res.status(200).json(child);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteChild = async (req, res) => {
    try {
        const child = await Child.findByIdAndDelete(req.params.id);

        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        await Parent.updateMany({ childId: req.params.id }, { $pull: { childId: req.params.id } });

        res.status(200).json({ message: 'Child profile deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createChild, getChild, editChild, deleteChild, saveUsageTime };
