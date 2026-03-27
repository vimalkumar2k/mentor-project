const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    coCurricularActivities: { type: String },
    extraCurricularActivities: { type: String },
    achievements: { type: String },
    certifications: { type: String },
    internships: { type: String },
    projects: { type: String },
    skillDevelopment: { type: String }
});

module.exports = mongoose.model('Activity', activitySchema);
