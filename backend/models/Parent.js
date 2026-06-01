import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        childId: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Child",
            default: [],
        },
        notification: {
            type:Boolean,
            default: true
        }
    },
    { timestamps: true },
);

const Parent = mongoose.model('Parent', parentSchema);

export default Parent;