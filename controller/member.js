const User = require("../models/User");

const membersName = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate({
            path: 'members',
            select: 'name _id'
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.members);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: e, message: 'Unable to fetch members name.' });
    }

}

module.exports = { membersName }
