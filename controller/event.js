const Event = require("../models/Event");
const User = require("../models/User");

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

const ongoingEvent=async(req,res)=>{
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
            date: { $lte: today.toISOString().slice(0, 10) } // Convert today's date to string for comparison
        });
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: e, message: 'Unable to fetch ongoing Events.' });
    }


}
module.exports = { createEvent,ongoingEvent }