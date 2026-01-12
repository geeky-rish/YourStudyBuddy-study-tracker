const express = require('express');
const router = express.Router();
const {
    getSubjects,
    setSubject,
    updateSubject,
    deleteSubject,
} = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSubjects).post(protect, setSubject);
router.route('/:id').delete(protect, deleteSubject).put(protect, updateSubject);

module.exports = router;
