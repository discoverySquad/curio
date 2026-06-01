import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const unsafeKeywords = [
    'gun',
    'knife',
    'weapon',
    'blood',
    'cigarette',
    'vape',
    'alcohol',
    'drug',
    'pill',
    'needle',
    'syringe',
    'explosive',
    'adult',
    'nude',
    'violence',
    'self-harm',
];

const containsUnsafeKeyword = (text = '') => {
    const value = text.toLowerCase();

    return unsafeKeywords.some((word) => value.includes(word));
};

router.post('/facts', async (req, res) => {
    try {
        const { objectName } = req.body;

        if (!objectName) {
            return res.status(400).json({
                success: false,
                message: 'Object name is required',
            });
        }

        if (containsUnsafeKeyword(objectName)) {
            return res.json({
                success: true,
                safe: false,
                objectName,
                facts: [],
                message: "Let's scan something safe and fun to learn about!",
            });
        }

        const response = await openai.responses.create({
            model: 'gpt-4o-mini',
            input: `
You are Curio, a child-friendly educational assistant for children ages 5 to 10.

Object scanned: "${objectName}"

First decide if this object is safe for children ages 5 to 10.

Unsafe objects include:
- weapons
- drugs
- alcohol
- smoking/vaping
- adult content
- graphic violence
- self-harm
- dangerous objects or activities

Return ONLY valid JSON in this format:

{
  "safe": true,
  "objectName": "${objectName}",
  "facts": [
    "Fact 1",
    "Fact 2",
    "Fact 3"
  ],
  "message": "Here are some fun facts!"
}

If unsafe, return:

{
  "safe": false,
  "objectName": "${objectName}",
  "facts": [],
  "message": "Let's scan something safe and fun to learn about!"
}
            `,
        });

        const cleaned = response.output_text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(cleaned);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.log('========== FACTS ERROR ==========');
        console.log(error);
        console.log('================================');

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
                success: false,
                message: 'Image is required',
            });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            max_tokens: 512,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `
You are Curio, a child-safe AI for children ages 5 to 10.

Look at the image and identify the main object.

Also decide if the object is safe and appropriate for children ages 5 to 10.

Unsafe objects include:
- weapons
- drugs
- alcohol
- smoking/vaping
- adult content
- graphic violence
- self-harm
- dangerous objects or activities

Return ONLY valid JSON:

{
  "objectName": "object name in English",
  "confidence": 0.95,
  "safe": true,
  "reason": "safe educational object"
}

If unsafe, return:

{
  "objectName": "detected object",
  "confidence": 0.95,
  "safe": false,
  "reason": "unsafe or sensitive object for children"
}
                            `,
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

        const text = response.choices[0].message.content;
        const cleaned = text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(cleaned);

        if (!result.safe || containsUnsafeKeyword(result.objectName)) {
            return res.json({
                success: true,
                safe: false,
                objectName: result.objectName,
                confidence: result.confidence,
                facts: [],
                message: "Let's scan something safe and fun to learn about!",
                reason: result.reason,
            });
        }

        res.json({
            success: true,
            safe: true,
            objectName: result.objectName,
            confidence: result.confidence,
            reason: result.reason,
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
