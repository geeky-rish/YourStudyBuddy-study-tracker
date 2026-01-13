const express = require('express');
const router = express.Router();
const {
    getSessions,
    addSession,
    updateSession,
    deleteSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSessions).post(protect, addSession);
router.route('/:id').delete(protect, deleteSession).put(protect, updateSession);

module.exports = router;
