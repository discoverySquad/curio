import Child from '../models/Child.js';
import JournalEntry from '../models/JournalEntry.js';

const createJournalEntry = async (req, res) => {
    try {
        const { childId, category, activityTitle, objectName, facts, correct } = req.body;

        if (!childId || !objectName) {
            return res.status(400).json({
                message: 'Child ID and object name are required',
            });
        }

        const child = await Child.findById(childId);

        if (!child) {
            return res.status(404).json({
                message: 'Child not found',
            });
        }

        const journalEntry = await JournalEntry.create({
            childId,
            category,
            activityTitle,
            objectName,
            facts: facts || [],
            correct: correct !== undefined ? correct : true,
        });

        res.status(201).json(journalEntry);
    } catch (error) {
        res.status(500).json({
            message: 'Could not create journal entry',
            error: error.message,
        });
    }
};

const getChildJournalEntries = async (req, res) => {
    try {
        const entries = await JournalEntry.find({
            childId: req.params.childId,
        }).sort({ createdAt: -1 });

        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({
            message: 'Could not load journal entries',
            error: error.message,
        });
    }
};

const deleteJournalEntry = async (req, res) => {
    try {
        const entry = await JournalEntry.findByIdAndDelete(req.params.id);

        if (!entry) {
            return res.status(404).json({
                message: 'Journal entry not found',
            });
        }

        res.status(200).json({
            message: 'Journal entry deleted',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Could not delete journal entry',
            error: error.message,
        });
    }
};

export { createJournalEntry, getChildJournalEntries, deleteJournalEntry };
