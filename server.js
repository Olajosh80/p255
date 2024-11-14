const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route to redirect .html requests to the URL without .html
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    res.redirect(`/${page}`); // Redirect to the path without .html
});

// Route to handle the actual serving of HTML files without .html
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `${page}.html`);

    // Check if the file exists
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});