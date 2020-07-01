const router = require("express").Router();
const verify = require("./verifyToken")

router.get("/", verify, (req, res) => {
    res.json({
        posts: "My first post",
        description: "Random data"
    })
})

module.exports = router