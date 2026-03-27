const MentoringForm = require('../models/MentoringForm');
const AcademicRecord = require('../models/AcademicRecord');
const Activity = require('../models/Activity');
const sharedStore = require('../config/mockData');

exports.saveFormProgress = async (req, res) => {
    try {
        const { studentId, semester, section, data } = req.body;
        
        const isDbConnected = require('mongoose').connection.readyState === 1;
        if (!isDbConnected) {
            let rec = sharedStore.mentoringForms.find(m => m.studentId === studentId && m.semester === semester);
            if (rec) {
                Object.assign(rec, data); 
            } else {
                sharedStore.mentoringForms.push({ studentId, semester, ...data });
            }
            return res.json({ message: 'Progress saved successfully (Mock)' });
        }

        // Master Upsert for Mentoring Record (strict: false allows all wizard fields)
        await MentoringForm.findOneAndUpdate(
            { studentId, semester }, 
            { $set: data, lastUpdated: new Date() }, 
            { upsert: true, new: true }
        );

        // SYNC basic student info if provided
        if (data.name || data.address || data.regNo) {
            const Student = require('../models/Student');
            await Student.findOneAndUpdate(
                { _id: studentId }, 
                { 
                    $set: {
                        ...(data.name && { name: data.name }),
                        ...(data.address && { address: data.address }),
                        ...(data.regNo && { studentId: data.regNo }),
                    }
                }
            ).catch(err => console.warn('Student sync failed (probably id is userId):', err.message));
        }
        
        res.json({ message: 'Progress saved successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFormData = async (req, res) => {
    try {
        const { studentId, semester } = req.params;

        const isDbConnected = require('mongoose').connection.readyState === 1;
        if (!isDbConnected) {
            const mentoring = sharedStore.mentoringForms.find(m => m.studentId === studentId && m.semester === semester) || null;
            const academic = sharedStore.academicRecords.find(a => a.studentId === studentId) || null;
            const activity = sharedStore.activities.find(a => a.studentId === studentId) || null;
            return res.json({ mentoring, academic, activity });
        }

        const mentoring = await MentoringForm.findOne({ studentId, semester });
        const academic = await AcademicRecord.findOne({ studentId });
        const activity = await Activity.findOne({ studentId });
        
        // ALSO fetch student basic info to pre-fill the wizard
        const Student = require('../models/Student');
        const student = await Student.findById(studentId);
        
        // Return flattened object so frontend doesn't need to handle nesting
        const combinedData = {
            ...(student ? { 
                name: student.name, 
                address: student.address, 
                regNo: student.studentId, // Map back to regNo for frontend
                gender: student.gender,
                dob: student.dob
            } : {}),
            ...(mentoring ? mentoring.toObject() : {}),
            ...(academic ? academic.toObject() : {}),
            ...(activity ? activity.toObject() : {})
        };
        
        res.json(combinedData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
