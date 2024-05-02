const Event = require("../models/Event");
const User = require("../models/User");
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK k
// const serviceAccount = require('../notifyem-15faf-firebase-adminsdk-eisda-ca8e0b518f.json');
const Notification = require("../models/Notification");
const PRIVATE_KEY = process.env.PRIVATE_KEY_FCM;
const serviceAccount = {
    "type": "service_account",
    "project_id": "notifyem-15faf",
    "private_key_id": PRIVATE_KEY,
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCbMu6KDhGbyh/I\nfYWpgGEDASNKBGotU7Mw60DTDdomLvhAzDqT6IH1VpVMgBG1hLuxwjJ8CmgF1pau\nABOjiOrKabzqsP6Dz6T5ulCff5Glo3lp5qiE/yMqcL+77I3gIfS6a7oNs/WHWAcI\nqVOfF6W/PJL/jgvxsYsn7f2YIMNT8VC1j1/1FBe1DUFZxw1R+ayL3lIT1MWJSg8r\nmhRwe5busmeZyBIMzXIooDAKJaSaOWGeUeSjYHloKJBfOrAKpuikbgu9ZfCC/xyR\nduoqAo+Qk8veb3f8FYeRtHhvWWzA4KMTGlVNLqxAdw76sHM31RdztUUtWi+pws9q\nieAdhoWtAgMBAAECggEAA1QQzJInq4UmsFiMzMlNi1BzbstwcX9piOOKtNwHsSjx\ntwYKPZDPdLECK61Vc+SgV9wX1BQvDez/t0SWJzww+N1SqV/ZXX9PBPILd5g3Seub\nF3vUYmHMYcUgP4n/su5XfsX/q/qPifMH15Y2DmPl8Jd+eY+Uzv6lQtp2RVRyi/LI\n3+w+q42xo2C5SrsRTcz8aofJrSaeoaYKS+aiyIvSjWq4hcsqgCwPuFubfpOIrhSG\nuR3yKBqZL2D8a2eZGxaXJ2RRKOCjJZVoMUjfHlKAK6DeIEVCtDeSINmk5h7GYZgl\nEv1dMWwd3IA/uY4X3SpBa3CZ+NA83YHNufats9YnWwKBgQDOELFUDjSdH/zl2kyA\nLMZ27EVy9y8z1kvg0eb35ZU/miSPfHcTE7rqyQggnqwgPoTyN1InBJUhjKk4gyAS\nlOytITTNnTr4g9Yig/7Kc0IRIcsfMT74L4A03j4nf4lW5Vexv3epb+dU0Z5Bh0kt\nN3Muk1j7XHeLXogicrHKTc463wKBgQDAzrz4il6reWdMkhUu6Tj/nY5zqNeD/V3Q\nvYaLV7LeQOyRn4NlRmFTHQ16NmAPxE6+suvWYemd/G8UCC3UQCRgfZUfrC4+LAxU\nisVem8X1nvQRphtIy+VPtcfHdnmRX5U04HEvxhcdCQJ4ymi+zi5B0SXYFYO2pUR4\nAeESKnPc8wKBgD3ABNOyehPHvSpH83rJcCO9A8bCyfNXuV9Cp1sMAmCP2XriCnC+\nDdpDqdrUkbIL6h0HdOfaWLI4C5GywY6v8AillcQz5LMKFsY7FcQnK9okbVEImd0X\npuyw2KFPd6GBknjiboJo1UK2mhz65HPXVP3VC+ovOGecSWFBS4PbMvyzAoGAEMNo\nxqsxI/OAObYRxWxdmkvWkNPDOSSUPYvc4MyVLqGyb87Qm8OMvq8t9sw3eed1eTsR\nKiiFKUlDVxiG84dIImOIzaIouxsVT1xpYJpmkb5qNgadJK0lmNKTNhJk63DGBjzl\nWmP8qneYEWx3wu8mMm6+vZTRSNYBp/Vx3iR2wmUCgYBiGyZIY9E3M4jELLmgEsMW\nuTPgwTIx1SDExItFUoVi+Vh+kTfmmh+BO7sWyazv8jjpeA8IzZEM5hNmRvzBz/6j\nwNPQvzCrD5tnxILWdwj0qyG38qQxhA26lWzNZYzM5IjGDrbUSxqZAnsPbF7cddLn\n26yHyOpYwBk8bbTeJRtJ8Q==\n-----END PRIVATE KEY-----\n",
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