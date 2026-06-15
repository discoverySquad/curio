import mongoose from 'mongoose';

const childSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        readingLevel: {
            type: String,
            default: 'beginner',
        },
        grade: {
            type: String,
            enum: ['Kindergarten', 'Grade1', 'Grade2'],
        },
        timeLimit: {
            type: Number,
            default: 60,
        },
        usageTimeToday: {
            type: Number,
            default: 0,
        },
        lastLoginAt: {
            type: Date,
            default: Date.now,
        },
        currentLevel: {
            type: Number,
            default: 0,
        },
        earnedBadges: [
            {
                badgeId: {
                    type: String,
                    required: true,
                },
                earnedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true },
);

const Child = mongoose.model('Child', childSchema);

export default Child;
