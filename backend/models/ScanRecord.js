// models/ScanRecord.js
import mongoose from 'mongoose';

const scanRecordSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: true,
        },
        categoryName: {
            type: String,
            required: true,
        },
        detectedLabel: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
        scannedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.model('ScanRecord', scanRecordSchema);