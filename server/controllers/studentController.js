const Student = require('../models/Student');
const User = require('../models/User');
const sharedStore = require('../config/mockData');

exports.getAllStudents = async (req, res) => {
    console.log('📋 Get All Students Request');
    try {
        const isDbConnected = require('mongoose').connection.readyState === 1;
        if (!isDbConnected) {
            console.warn('⚠️ Mock Mode: Fetching students');
            return res.json(sharedStore.students);
        }

        let query = {};
        if (req.user.role === 'Staff') {
            query.mentorId = req.user.id;
        }
        const students = await Student.find(query).populate('mentorId', 'name');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const isDbConnected = require('mongoose').connection.readyState === 1;
        if (!isDbConnected) {
            const student = sharedStore.students.find(s => s.userId === req.params.id);
            return res.json(student || null);
        }

        let student = await Student.findOne({ 
            $or: [
                { userId: req.params.id }, 
                { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }
            ].filter(q => q && Object.values(q)[0] !== null)
        }).populate('mentorId', 'name');
        
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateStudentProfile = async (req, res) => {
    try {
        const { studentId, name, department, year, contactNumber, parentContact, address } = req.body;
        const photo = req.file ? req.file.filename : undefined; // Store filename consistently

        // ALWAYS update the user's basic info first
        const user = await User.findByIdAndUpdate(req.user.id, {
            ...(name && { name }),
            ...(department && { department }),
            ...(contactNumber && { contactNumber }),
            ...(address && { address })
        }, { new: true });

        const isDbConnected = require('mongoose').connection.readyState === 1;
        if (!isDbConnected) {
            console.warn('⚠️ Mock Mode: Updating student profile');
            let student = sharedStore.students.find(s => s.userId === req.user.id);
            if (student) {
                Object.assign(student, { studentId, name, department, year, contactNumber, parentContact, address, photo });
            } else if (req.user.role === 'Student') {
                student = { userId: req.user.id, studentId, name, department, year, contactNumber, parentContact, address, photo };
                sharedStore.students.push(student);
            }
            return res.json({ student, user });
        }

        // Only handle Student record if user is actually a student (or we want to create one for them)
        let student = await Student.findOne({ userId: req.user.id });
        if (student) {
            student.name = name || student.name;
            student.studentId = studentId || student.studentId;
            student.department = department || student.department;
            student.year = year || student.year;
            student.contactNumber = contactNumber || student.contactNumber;
            student.parentContact = parentContact || student.parentContact;
            student.address = address || student.address;
            if (photo) student.photo = photo;
            await student.save();
        } else if (req.user.role === 'Student') {
            student = new Student({
                userId: req.user.id,
                studentId, name, department, year, contactNumber, parentContact, address, photo
            });
            await student.save();
        }
        res.json({ student, user, message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Profile Update Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.assignMentor = async (req, res) => {
    try {
        const { studentObjectId, mentorId } = req.body;

        const isDbConnected = require('mongoose').connection.readyState === 1;
        if (!isDbConnected) {
            console.warn('⚠️ Mock Mode: Assigning mentor');
            // Support both _id (internal mongo) and userId (our mock id) for flexibility
            const student = sharedStore.students.find(s => s._id === studentObjectId || s.userId === studentObjectId);
            if (student) {
                // Find mentor name for better UI feedback in mock mode
                const mentorUser = sharedStore.users.find(u => u._id === mentorId);
                student.mentorId = { _id: mentorId, name: mentorUser ? mentorUser.name : 'Unknown Mentor' };
            }
            return res.json(student);
        }

        const student = await Student.findByIdAndUpdate(studentObjectId, { mentorId }, { new: true });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const isDbConnected = require('mongoose').connection.readyState === 1;

        if (!isDbConnected) {
            const student = sharedStore.students.find(s => s.userId === userId);
            const mentoring = sharedStore.mentoringForms.filter(m => m.studentId === userId);
            const academic = sharedStore.academicRecords.find(a => a.studentId === userId);
            
            // Calculate progress - count non-empty fields in mentoring form pages
            let filledFields = 0;
            mentoring.forEach(page => {
                Object.values(page).forEach(val => { if (val) filledFields++; });
            });
            const progress = Math.min(Math.round((filledFields / 100) * 100), 100);

            return res.json({
                student,
                stats: [
                    { label: 'Form Progress', value: progress, color: 'primary' },
                    { label: 'Attendance', value: academic?.attendance || 0, color: 'success' },
                    { label: 'Current CGPA', value: academic?.cgpa || '0.0', color: 'warning' },
                    { label: 'Backlogs', value: academic?.backlogs || 0, color: 'info' },
                ]
            });
        }

        const student = await Student.findOne({ userId }).populate('mentorId', 'name').populate('userId', 'email');
        
        // Default Stats for new students in Live DB
        const defaultStats = [
            { label: 'Form Progress', value: student?.isFormSubmitted ? 100 : 0, color: 'primary' },
            { label: 'Attendance', value: 0, color: 'success' },
            { label: 'Current CGPA', value: '0.0', color: 'warning' },
            { label: 'Backlogs', value: 0, color: 'info' },
        ];

        res.json({ student, stats: defaultStats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.submitForm = async (req, res) => {
    try {
        const userId = req.user.id;
        const isDbConnected = require('mongoose').connection.readyState === 1;

        if (!isDbConnected) {
            const student = sharedStore.students.find(s => s.userId === userId);
            if (student) student.isFormSubmitted = true;
            return res.json({ message: 'Form submitted successfully (Mock)' });
        }

        await Student.findOneAndUpdate({ userId }, { isFormSubmitted: true });
        res.json({ message: 'Form submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMenteesByMentorId = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const students = await Student.find({ mentorId }).populate('userId', 'name email');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
