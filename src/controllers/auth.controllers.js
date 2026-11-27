const userModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @name registerUserController
 * @description register controller, expects username, email & password from the request
 * @access public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email & password",
        });
    }

    const isUSerAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }],
    });

    if (isUSerAlreadyExists) {
        return res.status(400).json({
            message: "User already exists with same username or email",
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
    });

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user: user.username,
        email: user.email,
    });
}

/**
 * @name loginUserController
 * @description login a user, expects a email & password from the req body
 * @access public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "Invalid emial or password",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password",
        });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
    );

    res.cookie("token", token);
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            email: user.email,
            username: user.username,
        },
    });
}

module.exports = {
    registerUserController,
    loginUserController,
};
