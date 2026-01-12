const asyncHandler = require('express-async-handler');
const Subject = require('../models/Subject');

// @desc    Get subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = asyncHandler(async (req, res) => {
    const subjects = await Subject.find({ user: req.user.id });
    res.status(200).json(subjects);
});

// @desc    Set subject
// @route   POST /api/subjects
// @access  Private
const setSubject = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400);
        throw new Error('Please add a text field');
    }

    const subject = await Subject.create({
        name: req.body.name,
        color: req.body.color || '#3b82f6',
        user: req.user.id,
    });

    res.status(200).json(subject);
});

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
        res.status(400);
        throw new Error('Subject not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the subject user
    if (subject.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedSubject);
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
        res.status(400);
        throw new Error('Subject not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the subject user
    if (subject.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await subject.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getSubjects,
    setSubject,
    updateSubject,
    deleteSubject,
};
