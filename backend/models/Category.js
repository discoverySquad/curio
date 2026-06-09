import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
        },
        categoryItem: [
            {
                task: {
                    type: String,
                    required: true,
                },
                img: {
                    type: String,
                    default: "",
                },
                description: {
                    type: String,
                },
            }
        ],
        activityInstruction: {
            type: String,
        }
    },
    { timestamps: true },
);

const Category = mongoose.model('Category', categorySchema);

export default Category;