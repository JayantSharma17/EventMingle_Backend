const express = require('express');
const { createEvent, ongoingEvent } = require('../controller/event');
const router = express.Router();

router.post('/create-event/:userId', createEvent);
router.post('/ongoing-event/:userId', ongoingEvent);


module.exports = router;