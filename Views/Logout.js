const express = require('express');
const { verifyUserAuth } = require('../MiddleWares/Auth');
const router = express.Router();

router.get('/logout', verifyUserAuth, (req, res) => {
    try {
        res.clearCookie('uid');
        res.json({
            success: true,
            message: 'Logout successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
});

module.exports = router;
