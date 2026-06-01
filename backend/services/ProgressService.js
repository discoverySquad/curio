import childProgress from "../models/Progress.js";

const recordActive = async (childId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const progress = await childProgress.findOne({ childId });
    if (!progress) {
        await childProgress.create({ childId, activeDates: [today], 'stats.activeDays': 1 });
        return;
    }

    const recorded = progress.activeDates.some(
        (date) => date.toDateString() === today.toDateString()
    );

    if (!recorded) {
        await childProgress.updateOne(
            { childId },
            {
                $push: { activeDates: today },
                $inc: { 'stats.activeDays': 1 },
                $set: { lastActiveAt: new Date() },
            }
        );
    }
}

const recordCompleteTask = async (childId, { correct = false, wasRetry = false, categoryKey = null }) => {
    const inc = { 'stats.totalTasks': 1 };

    if (correct) inc['stats.correctTasks'] = 1;
    if (wasRetry && correct) inc['stats.retrySuccess'] = 1;
    if (categoryKey && ['nature', 'shape'].includes(categoryKey)) {
        inc[`stats.categoryTasks.${categoryKey}`] = 1;
    }

    await childProgress.findOneAndUpdate(
        { childId },
        { $inc: inc, $set: { lastActiveAt: new Date() } },
        { upsert: true, new: true }
    );

    await recordActive(childId);
}

const recordScan = async (childId) => {
    await childProgress.findOneAndUpdate(
        { childId },
        {
            $inc: { 'stats.totalScans': 1 },
            $set: { lastActiveAt: new Date() },
        },
        { upsert: true, new: true }
    );

    await recordActive(childId);
}

const recordFactViewed = async (childId) => {
    await childProgress.findOneAndUpdate(
        { childId },
        {
            $inc: { 'stats.factsViewed': 1 },
            $set: { lastActiveAt: new Date() },
        },
        { upsert: true, new: true }
    );
}

export { recordCompleteTask, recordScan, recordFactViewed };