import mongoose from 'mongoose';

const badgeCriteriaSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: [
                'total_scans',  
                'total_tasks',   
                'correct_tasks',
                'facts_viewed',
                'app_days',
                'category_tasks',
                'retry_success',
            ],
            required: true,
        },
        threshold: { type: Number, required: true },
        categoryKey: { type: String, default: null },
    },
    { _id: false }
);

const badgeSchema = new mongoose.Schema(
    {
        badgeId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        category: {
            type: String,
            enum: ['exploration', 'learning', 'consistency', 'category_explorer'],
            required: true,
        },
        description: { type: String },
        icon: { type: String },
        criteria: { type: badgeCriteriaSchema, required: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;