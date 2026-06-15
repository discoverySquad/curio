// import mongoose from 'mongoose';
// import Child from '../models/Child.js';
// import Parent from '../models/Parent.js';

// const getChild = async (req, res) => {
//     try {
//         const child = await Child.findById(req.params.id);

//         if (!child) {
//             return res.status(404).json({ message: 'Child not found' });
//         }

//         const today = new Date().toDateString();
//         const lastLogin = child.lastLoginAt ? new Date(child.lastLoginAt).toDateString() : null;

// // create child information
// const createChild = async (req, res) => {
//   try {
//     let { name, avatar, grade, timeLimit, usageTimeToday, lastLoginAt, parentId } = req.body;
//     console.log("REQ BODY:", req.body);
//     console.log("PARENT ID:", parentId);
//     const child = await Child.create({
//       name,
//       avatar,
//       grade,
//       timeLimit,
//       usageTimeToday,
//       lastLoginAt,
//     });

//     if (!parentId) {
//       console.log("NO parentId, skipping parent update");
//     } else {
//       await Parent.findByIdAndUpdate(
//         parentId,
//         // avoid duplicate
//         { $addToSet: { childId: child._id } }
//       );
//     }
//         if (today !== lastLogin) {
//             await Child.findByIdAndUpdate(req.params.id, {
//                 usageTimeToday: 0,
//                 lastLoginAt: new Date(),
//             });
//         }

//         const updatedChild = await Child.findById(req.params.id);

//         res.json(updatedChild);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const createChild = async (req, res) => {
//     try {
//         const { parentId, name, age, avatar, readingLevel, grade, timeLimit } = req.body;

//         if (!parentId || !name || !age) {
//             return res.status(400).json({
//                 message: 'Parent ID, child name, and age are required',
//             });
//         }

//         const parent = await Parent.findById(parentId);

//         if (!parent) {
//             return res.status(404).json({ message: 'Parent not found' });
//         }

//         const child = await Child.create({
//             name,
//             age,
//             avatar,
//             readingLevel,
//             grade,
//             timeLimit,
//         });

//         await Parent.findByIdAndUpdate(parentId, {
//             $addToSet: { childId: child._id },
//         });

//         res.status(201).json(child);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const editChild = async (req, res) => {
//     try {
//         const { name, age, avatar, readingLevel, grade, timeLimit } = req.body;

//         const updateData = {};

//         if (name) updateData.name = name;
//         if (age !== undefined) updateData.age = age;
//         if (avatar !== undefined) updateData.avatar = avatar;
//         if (readingLevel !== undefined) updateData.readingLevel = readingLevel;
//         if (grade !== undefined) updateData.grade = grade;
//         if (timeLimit !== undefined) updateData.timeLimit = timeLimit;

//         const child = await Child.findByIdAndUpdate(req.params.id, updateData, {
//             new: true,
//             runValidators: true,
//         });

//         if (!child) {
//             return res.status(404).json({ message: 'Child not found' });
//         }

//         res.status(200).json(child);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const saveUsageTime = async (req, res) => {
//     try {
//         const { usageTimeToday } = req.body;

//         const child = await Child.findByIdAndUpdate(req.params.id, { $set: { usageTimeToday } }, { new: true });

//         if (!child) {
//             return res.status(404).json({ message: 'Child not found' });
//         }

//         res.status(200).json(child);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const deleteChild = async (req, res) => {
//     try {
//         const child = await Child.findByIdAndDelete(req.params.id);

//         if (!child) {
//             return res.status(404).json({ message: 'Child not found' });
//         }

//         await Parent.updateMany({ childId: req.params.id }, { $pull: { childId: req.params.id } });

//         res.status(200).json({ message: 'Child profile deleted' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
//     // delete children id from parent collection
//     await Parent.updateMany(
//       { childId: req.params.id },
//       { $pull: { childId: new mongoose.Types.ObjectId(req.params.id) } }
//     );

//     res.status(200).json({ message: "Account deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// export { createChild, getChild, editChild, deleteChild, saveUsageTime };
// };

// export { createChild, getChild, editChild, deleteChild, saveUsageTime };
import mongoose from 'mongoose';
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
        const { name, avatar, grade, timeLimit, usageTimeToday, lastLoginAt, readingLevel, age, parentId } = req.body;
        console.log("REQ BODY:", req.body);
        console.log("PARENT ID:", parentId);

        if (!parentId || !name || !age) {
            return res.status(400).json({
                message: 'Parent ID, child name, and age are required',
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
            usageTimeToday,
            lastLoginAt,
            readingLevel,
            age,
        });

        if (!parentId) {
            console.log("NO parentId, skipping parent update");
        } else {
            await Parent.findByIdAndUpdate(
                parentId,
                { $addToSet: { childId: child._id } }
            );
        }

        res.status(201).json(child);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editChild = async (req, res) => {
    try {
        const { name, age, avatar, readingLevel, grade, timeLimit } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (age !== undefined) updateData.age = age;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (readingLevel !== undefined) updateData.readingLevel = readingLevel;
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

        const child = await Child.findByIdAndUpdate(
            req.params.id,
            { $set: { usageTimeToday } },
            { new: true }
        );

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

        await Parent.updateMany(
            { childId: req.params.id },
            { $pull: { childId: new mongoose.Types.ObjectId(req.params.id) } }
        );

        res.status(200).json({ message: 'Child profile deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createChild, getChild, editChild, deleteChild, saveUsageTime };