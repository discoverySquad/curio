import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

import SafetyEvent from '../models/SafetyEvent.js';
import Notification from '../models/Notification.js';
import Parent from '../models/Parent.js';
import Child from '../models/Child.js';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const highUnsafeKeywords = ['gun', 'weapon', 'blood', 'violence', 'drug', 'needle', 'syringe', 'explosive', 'adult', 'nude', 'self-harm', 'suicide'];

const moderateUnsafeKeywords = ['knife', 'cigarette', 'vape', 'alcohol', 'pill', 'medicine', 'lighter'];

const getKeywordSeverity = (text = '') => {
    const value = text.toLowerCase();

    if (highUnsafeKeywords.some((word) => value.includes(word))) {
        return 'high';
    }

    if (moderateUnsafeKeywords.some((word) => value.includes(word))) {
        return 'moderate';
    }

    return 'safe';
};

const getParentByChildId = async (childId) => {
    return await Parent.findOne({
        childId: childId,
    });
};

const createParentNotification = async ({ parentId, childId, severity, objectName, message }) => {
    return await Notification.create({
        parentId,
        childId,
        type: 'safety_alert',
        severity,
        title: severity === 'high' ? 'Urgent Safety Alert' : 'Safety Notice',
        message,
        objectName,
        read: false,
    });
};

const handleHighUnsafeScan = async ({ childId, objectName, confidence, reason }) => {
    const parent = await getParentByChildId(childId);

    await SafetyEvent.create({
        childId,
        objectName,
        severity: 'high',
        confidence,
        reason,
        parentAlertCreated: Boolean(parent?.notification),
    });

    if (parent && parent.notification) {
        await createParentNotification({
            parentId: parent._id,
            childId,
            severity: 'high',
            objectName,
            message: `Curio detected a highly unsafe scan attempt: ${objectName}. No learning content was shown. Please check in with your child.`,
        });

        return {
            parentAlert: true,
            message: 'This does not look like something safe to explore right now. Please step away and ask a trusted adult for help.',
        };
    }

    return {
        parentAlert: false,
        message: 'This does not look like something safe to explore right now. Please step away and ask a trusted adult for help.',
    };
};

const handleModerateUnsafeScan = async ({ childId, objectName, confidence, reason }) => {
    const parent = await getParentByChildId(childId);

    await SafetyEvent.create({
        childId,
        objectName,
        severity: 'moderate',
        confidence,
        reason,
        parentAlertCreated: false,
    });

    const since = new Date();
    since.setHours(since.getHours() - 24);

    const unsafeCount = await SafetyEvent.countDocuments({
        childId,
        severity: 'moderate',
        createdAt: { $gte: since },
    });

    if (unsafeCount >= 3 && parent && parent.notification) {
        await createParentNotification({
            parentId: parent._id,
            childId,
            severity: 'moderate',
            objectName,
            message: 'Curio noticed multiple scans of objects that may not be suitable for learning activities.',
        });

        await SafetyEvent.updateMany(
            {
                childId,
                severity: 'moderate',
                createdAt: { $gte: since },
            },
            {
                parentAlertCreated: true,
            },
        );

        return {
            parentAlert: true,
            message: "Let's scan something safe and fun to learn about. Try scanning a tree, flower, book, or toy.",
        };
    }

    return {
        parentAlert: false,
        message: "Let's scan something safe and fun to learn about. Try scanning a tree, flower, book, or toy.",
    };
};

const getGradePromptConfig = (grade) => {
    switch (grade) {
        case 'Kindergarten':
            return {
                level: 'Kindergarten (age 5, Canadian curriculum)',
                instructions: 'Use very short sentences (5-7 words). Use only the simplest everyday words. Avoid any technical terms. Make it sound fun and playful, like you are talking to a 5-year-old. Connect to things children in Canada would recognize, like seasons, animals, or nature.',
                example: 'Dogs have four legs. They love to play outside. Dogs can be great friends!'
            };
        case 'Grade1':
            return {
                level: 'Grade 1 (age 6-7, Canadian curriculum)',
                instructions: 'Use short sentences (8-10 words). Use simple words but introduce one new word per fact with a simple explanation. Connect ideas to everyday life in Canada such as weather, plants, animals, or community. Keep it fun and encouraging.',
                example: 'Butterflies start as tiny eggs on a leaf. They grow inside a cocoon, which is like a cozy sleeping bag. Then they come out with beautiful wings and fly!'
            };
        case 'Grade2':
            return {
                level: 'Grade 2 (age 7-8, Canadian curriculum)',
                instructions: 'Use clear sentences (10-14 words). You can use some science words but always explain them simply. Reference concepts from Canadian science curriculum like living things, habitats, materials, and forces. Add interesting details that make kids curious and want to explore more.',
                example: 'Sharks have lived in the ocean for over 400 million years, long before dinosaurs. They have special organs called ampullae of Lorenzini that sense tiny electrical signals from nearby animals. Sharks are important to keeping ocean ecosystems healthy and balanced.'
            };
        default:
            return getGradePromptConfig('Grade1');
    }
};

router.post('/facts', async (req, res) => {
    try {
        const { objectName, childId } = req.body;

        if (!objectName) {
            return res.status(400).json({
                success: false,
                message: 'Object name is required',
            });
        }

        //Get grade (default is grade 1)
        let grade = 'Grade1';
        if (childId) {
            const child = await Child.findById(childId).select('grade');
            if (child?.grade) grade = child.grade;
        }

        const gradeConfig = getGradePromptConfig(grade);

        const keywordSeverity = getKeywordSeverity(objectName);

        if (keywordSeverity !== 'safe') {
            return res.json({
                success: true,
                safe: false,
                severity: keywordSeverity,
                objectName,
                facts: [],
                message:
                    keywordSeverity === 'high'
                        ? 'This does not look like something safe to explore right now. Please step away and ask a trusted adult for help.'
                        : "Let's scan something safe and fun to learn about!",
            });
        }

        const response = await openai.responses.create({
            model: 'gpt-4o-mini',
            input: `
You are Curio, a child-friendly educational assistant.

Object scanned: "${objectName}"
Reading level: ${gradeConfig.level}

Writing instructions: ${gradeConfig.instructions}

Example of the correct reading level:
"${gradeConfig.example}"

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
  "severity": "safe",
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
  "severity": "moderate or high",
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
        const { imageBase64, childId } = req.body;

        if (!imageBase64) {
            return res.status(400).json({
                success: false,
                message: 'Image is required',
            });
        }

        if (!childId) {
            return res.status(400).json({
                success: false,
                message: 'Child ID is required for safety tracking',
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
You are Curio, a child-safe visual assistant for children ages 5 to 10.

Look at the image and identify the main object.

Also decide if the object is safe and appropriate for children ages 5 to 10.

Severity options:
- "safe"
- "moderate"
- "high"

High severity includes weapons, drugs, blood, violence, self-harm, adult content, explosives, or clearly dangerous objects.
Moderate severity includes knives, lighters, medicine, pills, cigarettes, vapes, or alcohol.

Return ONLY valid JSON:

{
  "objectName": "object name in English",
  "confidence": 0.95,
  "safe": true,
  "severity": "safe",
  "reason": "safe educational object"
}

If unsafe, return:

{
  "objectName": "detected object",
  "confidence": 0.95,
  "safe": false,
  "severity": "moderate or high",
  "reason": "why this is unsafe or sensitive for children"
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

        const keywordSeverity = getKeywordSeverity(result.objectName);
        const finalSeverity = keywordSeverity !== 'safe' ? keywordSeverity : result.severity || 'safe';

        if (finalSeverity === 'high') {
            const safetyResult = await handleHighUnsafeScan({
                childId,
                objectName: result.objectName,
                confidence: result.confidence,
                reason: result.reason,
            });

            return res.json({
                success: true,
                safe: false,
                severity: 'high',
                objectName: result.objectName,
                confidence: result.confidence,
                facts: [],
                message: safetyResult.message,
                parentAlert: safetyResult.parentAlert,
                reason: result.reason,
            });
        }

        if (finalSeverity === 'moderate') {
            const safetyResult = await handleModerateUnsafeScan({
                childId,
                objectName: result.objectName,
                confidence: result.confidence,
                reason: result.reason,
            });

            return res.json({
                success: true,
                safe: false,
                severity: 'moderate',
                objectName: result.objectName,
                confidence: result.confidence,
                facts: [],
                message: safetyResult.message,
                parentAlert: safetyResult.parentAlert,
                reason: result.reason,
            });
        }

        res.json({
            success: true,
            safe: true,
            severity: 'safe',
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
