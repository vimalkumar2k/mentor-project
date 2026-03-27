const express = require('express');
const router = express.Router();
const { saveFormProgress, getFormData } = require('../controllers/formController');
const { auth } = require('../middleware/auth');

router.get('/:studentId/:semester', auth, getFormData);
router.post('/save', auth, saveFormProgress);

module.exports = router;
