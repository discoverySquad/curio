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
import gamificationRoute from './routes/gamificationRoute.js';
import uploadRoutes from './routes/uploadRoutes.js';
import journalRoute from './routes/journalRoute.js';
import { displayConnectionS3 } from './database/s3.js';
import activityRoutes from './routes/activityRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.get('/', (req, res) => {
    res.send('Curio API Running');
});

app.use('/api/ai', aiRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoute);
app.use('/api/child', childRoute);
app.use('/api/category', categoryRoute);
app.use('/api/gamification', gamificationRoute);
app.use('/api/journal', journalRoute);
app.use('/api/s3', uploadRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await displayConnectionS3();

        app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.log(error.message);
    });
