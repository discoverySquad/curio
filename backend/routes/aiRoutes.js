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

export default router;
