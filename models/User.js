const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "User must have a password"]
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member"
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }]
})

//hashing the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

//Generating JWT token
userSchema.methods.generateAuthToken = async function () {
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

const User = mongoose.model('User', userSchema);
module.exports = User;