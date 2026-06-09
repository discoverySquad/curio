import Badge from '../models/Badge.js';
import Child from "../models/Child.js";
import childProgress from "../models/Progress.js";
import { recordCompleteTask, recordScan, recordFactViewed } from "../services/ProgressService.js";
import { evaluateRewards } from "../services/BadgeService.js";

const completeTask = async (req, res) => {
    try {
        const { childId, correct, wasRetry, categoryKey } = req.body;

        await recordCompleteTask(childId, { correct, wasRetry, categoryKey });
        const { newBadges, newLevel } = await evaluateRewards(childId);

        res.status(200).json({ newBadges, newLevel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const completeScan = async (req, res) => {
    try {
        const { childId } = req.body;

        await recordScan(childId);
        const { newBadges, newLevel } = await evaluateRewards(childId);

        res.status(200).json({ newBadges, newLevel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const viewFact = async (req, res) => {
    try {
        const { childId } = req.body;

        await recordFactViewed(childId);
        const { newBadges, newLevel } = await evaluateRewards(childId);

        res.status(200).json({ newBadges, newLevel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getChildGamification = async (req, res) => {
    try {
        const child = await Child.findById(req.params.id).select('name avatar currentLevel earnedBadges');
        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        const progress = await childProgress.findOne({ childId: req.params.id }).select('status lastActiveAt');

        //get all badges
        const earned = child.earnedBadges.map(b => b.badgeId);
        const allBadges = await Badge.find().sort({ createdAt: 1 });
        const badgesWithStatus = allBadges.map(badge => ({
            ...badge.toObject(),
            earned: earned.includes(badge.badgeId),
            earnedAt: child.earnedBadges.find(b => b.badgeId === badge.badgeId)?.earnedAt ?? null,
        }));

        res.status(200).json({
            name: child.name,
            avatar: child.avatar,
            currentLevel: child.currentLevel,
            earnedBadges: child.earnedBadges,
            badges: badgesWithStatus,
            status: progress?.status ?? null,
            lastActiveAt: progress?.lastActiveAt ?? null,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { completeTask, completeScan, viewFact, getChildGamification };
