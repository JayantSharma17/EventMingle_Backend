const express = require('express');
const router = express.Router();
const { membersName } = require('../controller/member');

router.get('/member-names/:userId', membersName);

module.exports = router;