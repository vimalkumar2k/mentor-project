const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    tenthMarks: { type: String },
    twelfthMarks: { type: String },
    cgpa: { type: Number },
    sgpa: {
        sem1: Number,
        sem2: Number,
        sem3: Number,
        sem4: Number,
        sem5: Number,
        sem6: Number,
        sem7: Number,
        sem8: Number
    },
    backlogs: { type: Number, default: 0 }
});

module.exports = mongoose.model('AcademicRecord', academicSchema);
