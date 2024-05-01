const Event = require("../models/Event");
const User = require("../models/User");
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK k
// const serviceAccount = require('../notifyem-15faf-firebase-adminsdk-eisda-ca8e0b518f.json');
const Notification = require("../models/Notification");
const serviceAccount = {
    "type": "service_account",
    "project_id": "notifyem-15faf",
    "private_key_id": "ca8e0b518fda83a49a7ca6ca49795999ba549d16",
    "private_key": `${process.env.PRIVATE_KEY_FCM}`,
    "client_email": "firebase-adminsdk-eisda@notifyem-15faf.iam.gserviceaccount.com",
    "client_id": "107987603323155463548",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-eisda%40notifyem-15faf.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const createEvent = async (req, res) => {
    const userId = req.params.userId;
    console.log(new Date())

    const { name, location, date, startTime, endTime } = req.body;
    try {
        let userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Check if the event already exists for the user
        const eventExist = await Event.findOne({ name: name, userId: userId });
        if (eventExist) {
            return res.status(422).json({ message: 'Event already exists for this user.' });
        }
        let eventData = await new Event({ userId, name, location, date, startTime, endTime });
        let notificationData = await new Notification({ userId: userId, title: "New Event added", desc: `${name} Event added in your group.` })
        userData.events.push(eventData);
        userData.notifications.push(notificationData)
        await eventData.save();
        await notificationData.save();
        await userData.save();
        console.log(eventData);

        const fcmTokens = ["euoHzJ3UTpKH41MhBpB7U-:APA91bEYJaq0KvE5FQoEshpetJlmXbQKoW9HMiCREBZAx7LhgK9VQsTfKSybC4Vx9i02WjihIfnXqQMJ4biv22zTf_j4-0NOKLtYdbDmnW1tPaXgmHcuBw6oja6nfm7HfFwofspkTpy7","chvwUOhKRJWlLXbXZ3mfat:APA91bEh4wWLjIRFgCfzJwtnbNV7BtSVG7xYJGuZQy_KtOU5PCDt2EqRY154AV9l7eJIAh5aNDnQonMy4TkdYODjgYD0Pf8fdopVAYON-8jgZORcG1o169_x8Jf9QFpT0kurWFL7nutL"];

        // Send the notification to the specified devices using FCM tokens
        const message = {
            notification: {
                title: "New Event added",
                body: `${name} Event added in your group.`,
            },
            tokens: fcmTokens,
        };

        admin.messaging().sendEachForMulticast(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });


        return res.status(201).json({ message: "Event created successfully." })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: e, message: 'Event creation unsuccessful' })
    }
}

const ongoingEvent = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Get today's date
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set time to beginning of the day in UTC

        const events = await Event.find({
            _id: { $in: user.events },
            date: { $gte: today.toISOString() }// Convert today's date to string for comparison
        }).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: e, message: 'Unable to fetch ongoing Events.' });
    }
}
const completedEvent = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Get today's date
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set time to beginning of the day in UTC

        const events = await Event.find({
            _id: { $in: user.events },
            date: { $lt: today.toISOString() }// Convert today's date to string for comparison
        }).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: e, message: 'Unable to fetch ongoing Events.' });
    }
}
const getNotifications = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notificationsData = await Notification.find({
            _id: { $in: user.notifications },
        }).sort({ date: 1 });
        res.status(200).json(notificationsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: e, message: 'Unable to fetch notifications.' });
    }
}

module.exports = { createEvent, ongoingEvent, completedEvent, getNotifications }