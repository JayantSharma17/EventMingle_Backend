const express = require('express');
const { createTask, tasksInfo } = require('../controller/task');
const router = express.Router();

router.post('/create-task/:eventId', createTask);
router.get('/task-info/:eventId', tasksInfo);

module.exports = router;