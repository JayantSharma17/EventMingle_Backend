const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    dueDate: {
        type: String,
        required: true,
        trim: true,
    },
    postDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "active",
        enum: ["completed", "active"],
        required: [true, "task must have a status"]
    },
    desc: {
        type: String,
        trim: true,
    }
})

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;