const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    photo: { type: String },
    contactNumber: { type: String },
    parentContact: { type: String },
    address: { type: String },
    isFormSubmitted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);
