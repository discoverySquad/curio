import mongoose from 'mongoose';

const childSchema = new mongoose.Schema(
    {
        childId: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        age: {
            type: Number,
        },
        timeLimit: {
            type: Number,
        },
        usageTime: {
            type: Number,
        },
        lastLoginAt: {
            type: Date,
        },
        progress: [
        {
          categoryId: {
            type: String
          },
          completedAt: {
            type: Date,
          },
          badge: {
            type: String,
          }
        }
      ]
    },
    { timestamps: true },
);

const Child = mongoose.model('Child', childSchema);

export default Child;