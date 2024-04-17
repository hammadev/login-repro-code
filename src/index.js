import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';
import dotenv from 'dotenv';
import { Login,Get2FACode } from './services/login.js';
// Initialize express app
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Use Routes
app.use('/api/login', Login);
app.use('/api/submit-2fa-code', Get2FACode);

// Catch-all route for handling 404 (Not Found)
app.use((req, res, next) => {
    res.status(404).send("Sorry, can't find that!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

