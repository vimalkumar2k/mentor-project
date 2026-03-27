const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sharedStore = require('../config/mockData');

exports.register = async (req, res) => {
    console.log('📝 Registration Attempt:', req.body);
    try {
        const { name, email, password, role, department } = req.body;

        // Check DB state
        const isDbConnected = require('mongoose').connection.readyState === 1;

        if (!isDbConnected) {
            console.warn('⚠️ Using Mock Mode for Registration');
            const exists = sharedStore.users.find(u => u.email === email);
            if (exists) return res.status(400).json({ message: 'User already exists (Mock)' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { _id: Date.now().toString(), name, email, password: hashedPassword, role, department };
            sharedStore.users.push(newUser);

            // If it's a student, also add to the student store for dashboard visibility
            if (role === 'Student') {
                sharedStore.students.push({
                    userId: newUser._id,
                    studentId: 'STD-' + newUser._id.slice(-4),
                    name,
                    department,
                    year: '1st Year', // Default
                    isFormSubmitted: false
                });
            }

            const token = jwt.sign(
                { id: newUser._id, role: newUser.role }, 
                process.env.JWT_SECRET || 'secret_key_123',
                { expiresIn: '24h' }
            );
            return res.status(201).json({ token, user: { id: newUser._id, name, role } });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password, role, department });
        await user.save();

        // Create Student record if the role is Student
        let studentId = null;
        if (role === 'Student') {
            const Student = require('../models/Student');
            const newStudent = new Student({
                userId: user._id,
                studentId: 'STD-' + user._id.toString().slice(-4).toUpperCase(),
                name,
                department,
                year: '1st Year' // Default starting point
            });
            const savedStudent = await newStudent.save();
            studentId = savedStudent._id;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, studentId }, 
            process.env.JWT_SECRET || 'secret_key_123', 
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { id: user._id, studentId, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('❌ Registration Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    console.log('🔑 Login Attempt:', req.body.email);
    try {
        const { email, password } = req.body;
        
        const isDbConnected = require('mongoose').connection.readyState === 1;

        if (!isDbConnected) {
            console.warn('⚠️ Using Mock Mode for Login');
            const loginUser = sharedStore.users.find(u => u.email === email);
            if (!loginUser) {
                console.warn('❌ Mock Login: User not found:', email);
                return res.status(400).json({ message: `User ${email} not found in mock store. Please Register first.` });
            }

            const isMatch = await bcrypt.compare(password, loginUser.password);
            if (!isMatch) {
                console.warn('❌ Mock Login: Incorrect password for:', email);
                return res.status(400).json({ message: 'Invalid password (Mock)' });
            }

            const token = jwt.sign(
                { id: loginUser._id, role: loginUser.role }, 
                process.env.JWT_SECRET || 'secret_key_123',
                { expiresIn: '24h' }
            );
            return res.json({ token, user: { id: loginUser._id, name: loginUser.name, role: loginUser.role, department: loginUser.department } });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Find or Auto-Create Student record
        let studentObjectId = null;
        if (user.role === 'Student') {
            const Student = require('../models/Student');
            let studentDoc = await Student.findOne({ userId: user._id });
            if (!studentDoc) {
                console.warn('⚠️ Auto-creating missing Student record for:', user.name);
                studentDoc = new Student({
                    userId: user._id,
                    studentId: 'STD-' + user._id.toString().slice(-4).toUpperCase(),
                    name: user.name,
                    department: user.department || 'N/A',
                    year: '1st Year'
                });
                await studentDoc.save();
            }
            studentObjectId = studentDoc._id;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, studentId: studentObjectId }, 
            process.env.JWT_SECRET || 'secret_key_123', 
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user._id, studentId: studentObjectId, name: user.name, email: user.email, role: user.role, department: user.department } });
    } catch (err) {
        console.error('❌ Login Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const isDbConnected = require('mongoose').connection.readyState === 1;
        let profileUser;
        if (!isDbConnected) {
            profileUser = sharedStore.users.find(u => u._id === req.user.id);
            if (!profileUser) return res.status(404).json({ message: 'User not found (Mock)' });
            const { password, ...safeUser } = profileUser;
            return res.json(safeUser);
        }

        profileUser = await User.findById(req.user.id).select('-password');
        res.json(profileUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMentors = async (req, res) => {
    try {
        const isDbConnected = require('mongoose').connection.readyState === 1;
        if (!isDbConnected) {
            const mentors = sharedStore.users.filter(u => u.role === 'Staff');
            return res.json(mentors);
        }
        const mentors = await User.find({ role: 'Staff' }).select('-password');
        res.json(mentors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
