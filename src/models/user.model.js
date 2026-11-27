const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username already taken"],
        required: true,
    },
    email: {
        type: String,
        unique: [true, "User with this email exists"],
        trim: true,
        required: true,
    },
    password: {
        type :String,
        required: [true, "Please enter a password"],
    },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
