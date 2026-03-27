const express = require('express');
const router = express.Router();
const { getAssistantAccess, toggleAssistantAccess } = require('../controllers/configController');
const { auth, checkRole } = require('../middleware/auth');

router.get('/assistant-access', auth, getAssistantAccess);
router.post('/assistant-access', auth, checkRole(['HOD']), toggleAssistantAccess);

module.exports = router;
