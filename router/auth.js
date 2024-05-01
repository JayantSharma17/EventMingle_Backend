const express = require('express');
const { register, registerMember, userLogin, validateUser, validateMember, memberLogin, registerCSVMember } = require('../controller/auth');
const router = express.Router();

router.post('/register-user', register);
router.post('/register-member/:userId', registerMember);
router.post('/register-csvmember/:userId', registerCSVMember);
router.post('/login-user', userLogin);
router.post('/validate-user', validateUser);
router.post('/login-member', memberLogin);
router.post('/validate-member', validateMember);
// kkjhkj
module.exports = router;