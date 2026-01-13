const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        dailyTargetMinutes: {
            type: Number,
            required: [true, 'Please add a daily target'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Goal', goalSchema);
