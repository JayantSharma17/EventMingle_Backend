const express = require('express');
const { createEvent } = require('../controller/event');
const router = express.Router();

router.post('/create-event/:userId', createEvent);

module.exports = router;