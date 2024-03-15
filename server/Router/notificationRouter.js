const express = require('express');
const router = express.Router();
const sendEmailNotification = require('../Controller.js/emailNotifi');

const authenticateUser = require('../Middleware/protect');


router.post('/schedule', authenticateUser, async (req, res) => {
    const { time, subject, message } = req.body;
    const userEmail = req.user.email;

    try {
        await sendEmailNotification(userEmail, subject, message);
        res.status(200).json({ message: 'Notification scheduled successfully.' });
    } catch (error) {
        console.error('Error scheduling notification:', error);
        res.status(500).json({ error: 'Failed to schedule notification.' });
    }
});

module.exports = router;
