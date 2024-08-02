const express = require('express');
const path = require('path');
const entryRoutes = require('./routers/entries');
const logger = require('./logger');
require('dotenv').config();

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom logger middleware
app.use(logger);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Set up routes
app.use('/api/entries', entryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Server Error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;

