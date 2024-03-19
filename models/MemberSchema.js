const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const memberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: [true, "User must have a password"]
    }
})

//hashing the password
memberSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

//Generating JWT token
memberSchema.methods.generateAuthToken = async function () {
    try {
        let myToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '3d' });
        // this.tokens = this.tokens.concat({ token: myToken });
        // await this.save();
        return myToken;
    }
    catch (e) {
        console.log(e)
    }
}

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;