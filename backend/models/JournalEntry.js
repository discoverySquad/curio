import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema(
    {
        childId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Child',
            required: true,
        },
        category: {
            type: String,
            default: '',
        },
        activityTitle: {
            type: String,
            default: '',
        },
        objectName: {
            type: String,
            required: true,
            trim: true,
        },
        facts: {
            type: [String],
            default: [],
        },
        correct: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;
