const mongoose = require('mongoose');

const mentoringSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true },
    mentoringDate: { type: Date, default: Date.now },
    discussionPoints: { type: String },
    mentorRemarks: { type: String },
    studentIssues: { type: String },
    actionTaken: { type: String },
    careerGoals: { type: String },
    personalStrengths: { type: String },
    weaknesses: { type: String },
    challenges: { type: String },
    attendance: { type: Number },
    internalMarks: { type: String }, // Can be JSON string or structured
    semesterResults: { type: String },
    lastUpdated: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

module.exports = mongoose.model('MentoringForm', mentoringSchema);
