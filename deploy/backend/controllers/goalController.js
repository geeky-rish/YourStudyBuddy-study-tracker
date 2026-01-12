const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');

// @desc    Get goal
// @route   GET /api/goals
// @access  Private
const getGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findOne({ user: req.user.id });
    res.status(200).json(goal);
});

// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
    if (!req.body.dailyTargetMinutes) {
        res.status(400);
        throw new Error('Please add a target');
    }

    // Check if goal exists, update if so
    let goal = await Goal.findOne({ user: req.user.id });

    if (goal) {
        goal.dailyTargetMinutes = req.body.dailyTargetMinutes;
        const updatedGoal = await goal.save();
        res.status(200).json(updatedGoal);
    } else {
        goal = await Goal.create({
            user: req.user.id,
            dailyTargetMinutes: req.body.dailyTargetMinutes,
        });
        res.status(200).json(goal);
    }
});

module.exports = {
    getGoal,
    setGoal,
};
