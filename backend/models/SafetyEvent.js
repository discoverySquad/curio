import mongoose from 'mongoose';

const safetyEventSchema = new mongoose.Schema(
    {
        childId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Child',
            required: true,
        },
        objectName: {
            type: String,
            required: true,
            trim: true,
        },
        severity: {
            type: String,
            enum: ['moderate', 'high'],
            required: true,
        },
        confidence: {
            type: Number,
            default: null,
        },
        reason: {
            type: String,
            default: '',
        },
        parentAlertCreated: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const SafetyEvent = mongoose.model('SafetyEvent', safetyEventSchema);

export default SafetyEvent;
