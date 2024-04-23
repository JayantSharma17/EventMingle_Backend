const Event = require("../models/Event");
const Member = require("../models/Member");
const Task = require("../models/Task");

const createTask = async (req, res) => {
    const eventId = req.params.eventId;

    const { name, memberId, dueDate, desc } = req.body;
    try {
        let eventData = await Event.findById(eventId);
        if (!eventData) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        let taskData = await new Task({ name, memberId, dueDate, desc });
        eventData.tasks.push(taskData);
        await eventData.save();
        await taskData.save();
        console.log(taskData);
        return res.status(201).json({ message: "Task created successfully." })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: e, message: 'Task creation unsuccessful' })
    }
}


const tasksInfo = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId).populate({
            path: 'tasks',
            options: { sort: { 'dueDate': -1 } },
            populate: { path: 'memberId', select: 'name email phone position' }
        });
        if (!eventId) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event.tasks);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e, message: 'Unable to fetch Task info.' });
    }
}
const membersTask = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        let memberData = await Member.findById(memberId);
        if (!memberData) {
            return res.status(404).json({ message: 'Member not found.' });
        }
        const tasks = await Task.find({ memberId: memberId });
        res.status(200).json(tasks);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e, message: 'Unable to fetch Tasks for this particular member.' });
    }
}

module.exports = { createTask, tasksInfo, membersTask }