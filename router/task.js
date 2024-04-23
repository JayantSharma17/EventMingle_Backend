const express = require('express');
const { createTask, tasksInfo, membersTask } = require('../controller/task');
const router = express.Router();

router.post('/create-task/:eventId', createTask);
router.get('/task-info/:eventId', tasksInfo);
router.get('/members-task/:memberId', membersTask);

module.exports = router;