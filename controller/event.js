// const Event = require("../models/EventSchema");
const User = require("../models/UserSchema");

const createEvent = async (req, res) => {
    const userId = req.params.userId;

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
        userData.events.push(eventData);

        await eventData.save();
        await userData.save();
        console.log(eventData);
        return res.status(201).json({ message: "Event created successfully." })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: e, message: 'Event creation unsuccessful' })
    }
}

module.exports = { createEvent }