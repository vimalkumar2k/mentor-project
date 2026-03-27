const SystemConfig = require('../models/SystemConfig');

exports.getAssistantAccess = async (req, res) => {
    try {
        const config = await SystemConfig.findOne({ key: 'assistant_hod_access' });
        res.json({ enabled: config ? config.value : true }); // Default to true if not set
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.toggleAssistantAccess = async (req, res) => {
    try {
        const { enabled } = req.body;
        await SystemConfig.findOneAndUpdate(
            { key: 'assistant_hod_access' },
            { value: enabled, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        res.json({ message: `Assistant HOD access ${enabled ? 'activated' : 'deactivated'} successfully`, enabled });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
