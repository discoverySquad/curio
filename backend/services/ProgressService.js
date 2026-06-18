import childProgress from "../models/Progress.js";

const recordActive = async (childId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const progress = await childProgress.findOne({ childId });
    if (!progress) {
        await childProgress.create({ childId, activeDates: [today], status: { activeDays: 1 } });
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
                $inc: { 'status.activeDays': 1 },
                $set: { lastActiveAt: new Date() },
            }
        );
    }
}

const recordCompleteTask = async (childId, { correct = false, wasRetry = false, categoryKey = null }) => {
    const inc = { 'status.totalTasks': 1 };

    if (correct) inc['status.correctTasks'] = 1;
    if (wasRetry && correct) inc['status.retrySuccess'] = 1;
    if (categoryKey && ['nature', 'shape'].includes(categoryKey)) {
        inc[`status.categoryTasks.${categoryKey}`] = 1;
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
        { $inc: { 'status.totalScans': 1 }, $set: { lastActiveAt: new Date() } },
        { upsert: true, new: true }
    );

    await recordActive(childId);
};

const recordFactViewed = async (childId) => {
    await childProgress.findOneAndUpdate(
        { childId },
        {
            $inc: { 'status.factsViewed': 1 },
            $set: { lastActiveAt: new Date() },
        },
        { upsert: true, new: true }
    );

    await recordActive(childId);
}

export { recordCompleteTask, recordScan, recordFactViewed };