const express = require('express');
const { register, registerMember, userLogin, validateUser, validateMember, memberLogin } = require('../controller/auth');
const router = express.Router();

router.post('/register-user', register);
router.post('/register-member/:userId', registerMember);
router.post('/login-user', userLogin);
router.post('/validate-user', validateUser);
router.post('/member-user', memberLogin);
router.post('/validate-member', validateMember);

module.exports = router;