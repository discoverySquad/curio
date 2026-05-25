import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import parentRoute from './routes/parentRoute.js';
import childRoute from './routes/childRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import userRoutes from './routes/userRoutes.js'; // test

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Curio API Running');
});

app.use('/api/users', userRoutes); //test

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoute);
app.use('/api/child', childRoute);
app.use('/api/category', categoryRouteRoute);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.log(error.message);
    });
