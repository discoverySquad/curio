
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Parent',
            required: true,
        },
        childId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Child',
            required: true,
        },
        type: {
            type: String,
            enum: ['safety_alert', 'learning_update', 'system'],
            default: 'safety_alert',
        },
        severity: {
            type: String,
            enum: ['moderate', 'high'],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        objectName: {
            type: String,
            default: '',
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
