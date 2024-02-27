const express = require("express")
const router = express.Router();

const registerAPI = require("./api_register")
const loginAPI = require("./api_login")
const customerAPI = require("./api_customer")

router.use(registerAPI)
router.use(loginAPI)
router.use(customerAPI)
//import
module.exports = router;