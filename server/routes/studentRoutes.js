const express = require('express');
const router = express.Router();
const {
    getAllStudents,
    getStudentById,
    updateStudentProfile,
    assignMentor,
    getDashboardData,
    submitForm,
    getMenteesByMentorId
} = require('../controllers/studentController');
const { auth, checkRole } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', auth, getAllStudents);
router.get('/dashboard', auth, checkRole(['Student']), getDashboardData);
router.post('/profile', auth, upload.single('photo'), updateStudentProfile);
router.post('/assign', auth, checkRole(['HOD', 'Assistant HOD']), assignMentor);
router.post('/submit-form', auth, checkRole(['Student']), submitForm);
router.get('/mentor/:mentorId', auth, checkRole(['HOD', 'Assistant HOD']), getMenteesByMentorId);
router.get('/:id', auth, getStudentById);

module.exports = router;
