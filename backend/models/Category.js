import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        categoryId: {
            type: String,
            unique: true,
        },
        categoryName: {
            type: String,
            required: true,
        },
        categoryItem: {
            type: [String],
        },
        activityInstruction: {
            type:String,
        }
    },
    { timestamps: true },
);

const Category = mongoose.model('Category', categorySchema);

export default Category;