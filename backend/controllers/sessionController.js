const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const Subject = require('../models/Subject');

// @desc    Get sessions
// @route   GET /api/sessions
// @access  Private
const getSessions = asyncHandler(async (req, res) => {
    const sessions = await Session.find({ user: req.user.id })
        .populate('subject', 'name color')
        .sort({ date: -1 }); // Newest first
    res.status(200).json(sessions);
});

// @desc    Add session
// @route   POST /api/sessions
// @access  Private
const addSession = asyncHandler(async (req, res) => {
    const { subject, duration, date, notes } = req.body;

    if (!subject || !duration) {
        res.status(400);
        throw new Error('Please add subject and duration');
    }

    // Verify subject ownership/existence
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
        res.status(404);
        throw new Error('Subject not found');
    }

    if (subjectExists.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized for this subject');
    }

    const session = await Session.create({
        user: req.user.id,
        subject,
        duration,
        date: date || Date.now(),
        notes,
    });

    const populatedSession = await session.populate('subject', 'name color');

    res.status(200).json(populatedSession);
});

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (!session) {
        res.status(400);
        throw new Error('Session not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (session.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedSession = await Session.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).populate('subject', 'name color');

    res.status(200).json(updatedSession);
});

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (!session) {
        res.status(400);
        throw new Error('Session not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (session.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await session.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getSessions,
    addSession,
    updateSession,
    deleteSession,
};
