const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logger
app.use((req, res, next) => {
    console.log(`🔌 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/api/health', (req, res) => res.json({ status: 'UP', isDbConnected: mongoose.connection.readyState === 1 }));

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const formRoutes = require('./routes/formRoutes');
const configRoutes = require('./routes/configRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/config', configRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mentoring_system';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected successfully to:', MONGO_URI);
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error details:');
        console.error(err);
        // Start server anyway so user can see the UI and we can debug API
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (WITHOUT DATABASE)`));
    });
