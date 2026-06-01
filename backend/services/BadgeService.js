import Badge from '../models/Badge.js';
import Level from '../models/Level.js';
import Child from '../models/Child.js';
import childProgress from '../models/Progress.js';

const isBadgeEarned = (criteria, status) => {
    const { type, threshold, categoryKey } = criteria;

    switch (type) {
        case 'total_scans':    return status.totalScans >= threshold;
        case 'total_tasks':    return status.totalTasks >= threshold;
        case 'correct_tasks':  return status.correctTasks >= threshold;
        case 'facts_viewed':   return status.factsViewed >= threshold;
        case 'app_days':       return status.activeDays >= threshold;
        case 'retry_success':  return status.retrySuccess >= threshold;
        case 'category_tasks':
            if (!categoryKey) return false;
            return (status.categoryTasks?.[categoryKey] ?? 0) >= threshold;
        default:
            console.warn(`Unknown criteria type: ${type}`);
            return false;
    }
};

const checkAndAwardBadges = async (childId) => {
    const [child, progress, allBadges] = await Promise.all([
        Child.findById(childId),
        childProgress.findOne({ childId }),
        Badge.find(),
    ]);

    if (!child || !progress) throw new Error('Child or progress not found');

    const earnedSet = new Set(child.earnedBadges.map((b) => b.badgeId));
    const newlyEarned = [];

    for (const badge of allBadges) {
        if (earnedSet.has(badge.badgeId)) continue;
        if (isBadgeEarned(badge.criteria, progress.status)) {
            newlyEarned.push(badge.badgeId);
        }
    }

    if (newlyEarned.length > 0) {
        const now = new Date();
        const newBadgeDocs = newlyEarned.map((badgeId) => ({ badgeId, earnedAt: now }));
        await Child.updateOne(
            { _id: childId },
            { $push: { earnedBadges: { $each: newBadgeDocs } } }
        );
    }

    return newlyEarned;
};

const checkAndUpdateLevel = async (childId) => {
    const [child, allLevels] = await Promise.all([
        Child.findById(childId),
        Level.find().sort({ level: 1 }),
    ]);

    if (!child) throw new Error('Child not found');

    const earnedSet = new Set(child.earnedBadges.map((b) => b.badgeId));
    let newLevel = 0;

    for (const levelDef of allLevels) {
        const { all, anyOf } = levelDef.requiredBadges;
        const allSatisfied = all.every((id) => earnedSet.has(id));
        const anyOfSatisfied = anyOf.length === 0 || anyOf.some((id) => earnedSet.has(id));

        if (allSatisfied && anyOfSatisfied) {
            newLevel = levelDef.level;
        } else {
            break;
        }
    }

    if (newLevel > child.currentLevel) {
        await Child.updateOne({ _id: childId }, { $set: { currentLevel: newLevel } });
    }

    return newLevel;
};

const evaluateRewards = async (childId) => {
    const newBadges = await checkAndAwardBadges(childId);

    let newLevel = null;
    if (newBadges.length > 0) {
        newLevel = await checkAndUpdateLevel(childId);
    }

    return { newBadges, newLevel };
};

export { checkAndAwardBadges, checkAndUpdateLevel, evaluateRewards };