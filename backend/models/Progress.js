import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
    {
        childId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Child",
            required: true,
            unique: true,
        },
        status: {
            totalTasks: { type: Number, default: 0 },
            totalScans: { type: Number, default: 0 },
            correctTasks: { type: Number, default: 0 },
            factsViewed: { type: Number, default: 0 },
            retrySuccess: { type: Number, default: 0 },
            activeDays: { type: Number, default: 0 },
            categoryTasks: {
                nature: { type: Number, default: 0 },
                shape: { type: Number, default: 0 },
            },
        },
        activeDates: { type: [Date], default: [] },
        lastActiveAt: { type: Date },
    },
    { timestamps: true }
);

const childProgress = mongoose.model("Progress", progressSchema);

export default childProgress;