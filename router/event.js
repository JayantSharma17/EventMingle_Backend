const express = require('express');
const { createEvent, ongoingEvent, completedEvent } = require('../controller/event');
const router = express.Router();

router.post('/create-event/:userId', createEvent);
router.get('/ongoing-event/:userId', ongoingEvent);
router.get('/completed-event/:userId', completedEvent);

module.exports = router;