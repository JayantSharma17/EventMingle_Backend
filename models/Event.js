const mongoose = require('mongoose');
//test h j

const eventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        // unique: true
    },
    location: {
        type: String,
        trim: true,
        required: true,
    },
    desc: {
        type: String,
        default:''
    },
    date: {
        type: String,
        trim: true,
        required: true,
    },
    startTime: {
        type: String,
        trim: true,
        required: true,
    },
    endTime: {
        type: String,
        trim: true,
        required: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }] 
})

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;