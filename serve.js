const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

// Serve static files
app.use(express.static(__dirname));

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎨 SOUniverse Dashboard v3.0 serving on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: https://seeing-proud-talks-receptor.trycloudflare.com`);
});
