const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
router.post("/register", async (req, res) => {
    const validation = registerValidation(req.body);
    if ("error" in validation) {
        return res.status(400).end(validation.error.details[0].message);
    }

    // Check if email exists in db
    const emailExist = await User.findOne({
        email: req.body.email,
    });

    if (emailExist) {
        return res.status(400).end("Email already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({
            name: savedUser.name,
            email: savedUser.email,
        });
    } catch (err) {
        res.sendStatus(400).send(err);
    }
});

// LOGIN

router.post("/login", async (req, res) => {
    const validation = loginValidation(req.body);
    if ("error" in validation) {
        return res.status(400).end(validation.error.details[0].message);
    }

    // Check if email exists in db
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        return res.status(400).end("Email doesnt exist");
    }

    // check password status

    const valid_pass = await bcrypt.compare(req.body.password, user.password);

    if (!valid_pass) {
        return res.status(400).end("Invalid password");
    }

    // create and assaign a jwt
    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
    res.header("auth-token", token).send(token);
});

module.exports = router;
