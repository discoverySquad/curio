import express from 'express';
import { createJournalEntry, getChildJournalEntries, deleteJournalEntry } from '../controllers/journalController.js';

const router = express.Router();

router.post('/', createJournalEntry);
router.get('/child/:childId', getChildJournalEntries);
router.delete('/:id', deleteJournalEntry);

export default router;
