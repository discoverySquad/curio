import mongoose from 'mongoose';

const childSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        grade: {
            type: String,
            enum: ["Kindergarten", "Grade1", "Grade2"],
            required: true, 
        },
        timeLimit: {
            type: Number,
            required: true,
        },
        usageTimeToday: {
            type: Number,
            default: 0, 
        },
        lastLoginAt: {
            type: Date,
        },
        currentLevel: {
            type: Number,
            default: 0,
        },
        earnedBadges: [
            {
                badgeId: { type: String,
                           required: true
                },
                earnedAt: { type: Date,
                            default: Date.now
                },
            }
        ],
    },
    { timestamps: true },
);

const Child = mongoose.model('Child', childSchema);

export default Child;