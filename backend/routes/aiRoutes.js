import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/facts', async (req, res) => {
    try {
        const { objectName } = req.body;

        if (!objectName) {
            return res.status(400).json({
                message: 'Object name is required',
            });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.responses.create({
            model: 'gpt-4o-mini',
            input: `Give 3 short child-friendly fun facts about ${objectName}. Keep it simple for children ages 5 to 10.`,
        });

        res.json({
            success: true,
            objectName,
            facts: response.output_text,
        });
    } catch (error) {
        console.log('========== OPENAI ERROR ==========');
        console.log(error);
        console.log('=================================');

        res.status(500).json({
            success: false,
            message: 'AI failed to generate facts',
            error: error.message,
        });
    }
});


router.post('/scan', async (req, res) => {
    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            return res.status(400).json({
                message: 'Image is required',
            });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            max_tokens: 512,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBase64}`,
                            },
                        },
                        {
                            type: 'text',
                            text: `You are an expert object detector. Identify the single most prominent object in this image. Be specific (e.g. 'red apple' not just 'fruit') Respond with ONLY a JSON object in this format, no extra text:
                            {
                            "objectName": "object name in English"
                            "confidence": 0.95
                            }`,
                        },
                    ],
                },
            ],
        });

        const text = response.choices[0].message.content;
        const cleaned = text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(cleaned);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.log('========== SCAN ERROR ==========');
        console.log(error);
        console.log('================================');

        res.status(500).json({
            success: false,
            message: 'AI failed to scan image',
            error: error.message,
        });
    }
});


export default router;
