const express = require("express")
const router = express.Router()
//ການສ້າງ router
router.post("/login", function(req, res){
    res.send("Hello World login V2")
})


//========
module.exports = router;
