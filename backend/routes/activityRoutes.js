import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import ScanRecord from '../models/ScanRecord.js';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const checkTaskMatch = async (detectedLabel, taskName) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 100,
        messages: [
            {
                role: 'user',
                content: `
You are helping a child complete a scavenger hunt activity.

The child was asked to find: "${taskName}"
The camera detected: "${detectedLabel}"

Judge loosely and generously — if the detected object is a reasonable match for the task, return true.
For example: "sticky note" matches "Square Box" because a sticky note is square-shaped.

Answer ONLY with valid JSON: { "match": true } or { "match": false }
                `,
            },
        ],
    });

    const text = response.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    return result.match;
};

router.post('/verify', async (req, res) => {
    try {
        const { imageBase64, taskName, categoryName, childId } = req.body;

        if (!imageBase64 || !taskName || !categoryName) {
            return res.status(400).json({
                success: false,
                message: 'imageBase64, taskName, categoryName are required',
            });
        }

        // 画像から物体を検出
        const scanResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            max_tokens: 256,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Identify the main object in this image. Return ONLY valid JSON: { "objectName": "object name in English", "confidence": 0.95 }`,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBase64}`,
                            },
                        },
                    ],
                },
            ],
        });

        const scanText = scanResponse.choices[0].message.content;
        const scanCleaned = scanText.replace(/```json|```/g, '').trim();
        const scanResult = JSON.parse(scanCleaned);

        // Check if its match the task
        const isMatch = await checkTaskMatch(scanResult.objectName, taskName);
        console.log('taskName:', taskName);
        console.log('detectedLabel:', scanResult.objectName);
        console.log('isMatch:', isMatch);

        // If true then save
        if (isMatch) {
            await ScanRecord.create({
                childId,
                taskName,
                categoryName,
                detectedLabel: scanResult.objectName,
                isCorrect: true,
                scannedAt: new Date(),
            });
        }

        res.json({
            success: true,
            isMatch,
            detectedLabel: scanResult.objectName,
            confidence: scanResult.confidence,
        });

    } catch (error) {
        console.log('========== VERIFY ERROR ==========');
        console.log(error);
        console.log('==================================');

        res.status(500).json({
            success: false,
            message: 'Failed to verify task',
            error: error.message,
        });
    }
});

router.get('/records', async (req, res) => {
    try {
        const records = await ScanRecord.find().sort({ scannedAt: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;