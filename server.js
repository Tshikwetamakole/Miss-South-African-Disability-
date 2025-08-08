const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'events.html'));
});

app.get('/advocacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'advocacy.html'));
});

app.get('/sponsors', (req, res) => {
    res.sendFile(path.join(__dirname, 'sponsors.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Here you would typically send email or save to database
    console.log('Contact form submitted:', { name, email, message });
    
    res.json({ success: true, message: 'Thank you for your message. We will get back to you soon!' });
});

app.post('/api/apply', (req, res) => {
    const application = req.body;
    
    // Basic validation
    if (!application.fullName || !application.email || !application.age) {
        return res.status(400).json({ error: 'Required fields missing' });
    }
    
    // Here you would typically save to database
    console.log('Application received:', application);
    
    res.json({ success: true, message: 'Application submitted successfully!' });
});

// Error handling
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from public directory`);
});
