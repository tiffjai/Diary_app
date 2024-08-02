const express = require('express');
const path = require('path');
const logger = require('./logger');
const entriesRouter = require('./routers/entries');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Serve static files
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api/entries', entriesRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
