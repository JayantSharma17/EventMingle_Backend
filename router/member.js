const express = require('express');
const { membersName } = require('../controller/member');
const router = express.Router();

router.post('/member-names/:userId', membersName);

module.exports = router;