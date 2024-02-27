const express = require("express")
const router = express.Router();

const registerAPI = require("./api_register")
const loginAPI = require("./api_login")

router.use(registerAPI)
router.use(loginAPI)
//import
module.exports = router;