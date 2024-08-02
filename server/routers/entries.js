const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entries');

// Route to create a new entry
router.post('/', entriesController.createEntry);

// Route to get all entries with optional search parameters
router.get('/', entriesController.getAllEntries);

// Route to get an entry by ID
router.get('/:id', entriesController.getEntryById);

// Route to update an entry by ID
router.put('/:id', entriesController.updateEntry);

// Route to delete an entry by ID
router.delete('/:id', entriesController.deleteEntry);

module.exports = router;



