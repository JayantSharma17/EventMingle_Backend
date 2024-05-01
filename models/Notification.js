const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        default:''
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;