import Child from "../models/Child.js";
import childProgress from "../models/Progress.js";
import { recordCompleteTask, recordScan, recordFactViewed } from "../services/ProgressService.js";

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

        const progress = await childProgress.findOne({ childId: req.params.id }).select('stats lastActiveAt');

        res.status(200).json({
            name: child.name,
            avatar: child.avatar,
            currentLevel: child.currentLevel,
            earnedBadges: child.earnedBadges,
            stats: progress?.stats ?? null,
            lastActiveAt: progress?.lastActiveAt ?? null,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { completeTask, completeScan, viewFact, getChildGamification };
