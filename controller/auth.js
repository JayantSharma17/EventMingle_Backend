const Member = require("../models/MemberSchema");
const User = require("../models/UserSchema");
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).send('All fields are required.')
    }
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ message: 'email already exist' });
        }

        const userdata = await new User({ name, email, password });

        //middleware password hashing working here from userSchema
        await userdata.save();
        return res.status(201).json({ message: "Registration successfull." })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: e, message: 'Registration unsuccesfull' })
    }
}

const registerMember = async (req, res) => {
    const userId = req.params.userId;

    const { name, email, phone } = req.body;
    const password = generator.generate({
        length: 5,
        numbers: true
    });
    if (!name || !email || !password || !phone) {
        return res.status(422).send('All fields are required.')
    }
    try {
        const memberExist = await Member.findOne({ email: email });
        if (memberExist) {
            return res.status(422).json({ message: 'email already exist of this member.' });
        }
        let userData = await User.findById(userId);
        let memberData = await new Member({ userId, name, email, phone, password });
        userData.members.push(memberData);

        //middleware password hashing working here from userSchema
        await memberData.save();
        await userData.save();
        console.log(`Password for member: ${password}`);
        console.log(memberData)
        return res.status(201).json({ message: "Member signup successfull.", password: password })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: e, message: 'Member signup unsuccesfull' })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailExist = await User.findOne({ email: email });
        if (emailExist) {
            const isMatch = await bcrypt.compare(password, emailExist.password);
            if (isMatch) {
                console.log(emailExist)
                const token = await emailExist.generateAuthToken();
                console.log(`Token: ${token}`);
                res.status(200).json({ message: "User Login successfully", response: emailExist, token: token });
            }
            else {
                res.status(400).json({ message: "Invalid Credentials p" });
            }
        }
        else {
            res.status(400).json({ message: "Invalid Credentials m" });
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

const validateUser = async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        const userId = user._id;
        const userData = await User.findById(userId);
        console.log(userData)
        res.status(200).json({ message: "Authorized User", response: userData, token: token });

    }
    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

const memberLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailExist = await Member.findOne({ email: email });
        if (emailExist) {
            const isMatch = await bcrypt.compare(password, emailExist.password);
            if (isMatch) {
                console.log(emailExist)
                const token = await emailExist.generateAuthToken();
                console.log(`Token: ${token}`);
                res.status(200).send({ message: "Member Login successfully", response: emailExist, token: token });
            }
            else {
                res.status(400).json({ message: "Invalid Credentials p" });
            }
        }
        else {
            res.status(400).json({ message: "Invalid Credentials m" });
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

const validateMember = async (req, res) => {
    //check
    const { token } = req.body;
    try {
        const member = jwt.verify(token, process.env.SECRET_KEY);
        const MemberId = member._id;
        const memberData = await Member.findById(MemberId);
        console.log(memberData)
        res.status(200).json({ message: "Authorized Member", response: memberData, token: token });
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

module.exports = { register, registerMember, userLogin, validateUser, memberLogin ,validateMember}