import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema(
    {
        level: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        requiredBadges: {
            all: { type: [String], default: [] },
            anyOf: { type: [String], default: [] },
        },
    },
    { timestamps: true }
);

const Level = mongoose.model('Level', levelSchema);

export default Level;