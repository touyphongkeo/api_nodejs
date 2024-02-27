const express = require("express")
const router = express.Router()
const jwt = require("../../jwt")
const monent = require("moment")

var rateLimit = require("express-rate-limit")//npm i express-rate-limit

const appLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, //1 minute
    max: 2,
    message: "Too many reqests, please try again later !"
})






var bcrypt = require('bcryptjs');
//ການເອິນຖານຂໍ້ມູນມານຳໃຊ້
const db = require("../../db")
//ການສ້າງ router
router.post("/login",appLimiter, function (req, res) {
    // res.send("Hello World login V2")

    // db.query("SELECT * FROM tbl_customer", function (err, rs) {
    //     if(err) throw err
    //     console.log("Connect db Successfult")
    //     res.send("Connect db Successfult")
    // })


    //    const email = req.sanitize(req.body.email);
    //    res.send(email)

    //ການທົດລອງສົງ
    const email = req.sanitize(req.body.email)
    const password = req.sanitize(req.body.password)

   // res.json({email_key: email, password_key: password})
    let sql = "SELECT uuid,email,password,customer_name,last_name FROM tbl_customer WHERE email = ? LIMIT 1"
    db.query(sql, [email], function(err, rs){
        if(err) throw err;
         //ກວດກາເບິງ ລະຫັດຜ່ານ
         if(rs.length > 0){
            let isSuccess = bcrypt.compareSync(password, rs[0].password)
            if(isSuccess == true){

                var payload = {
                    uuid: rs[0].uuid,
                    email: email,
                    create_dated: monent().format("YYYY-MM-DD:H:m:s")
                }
                const token = jwt.sign(payload)


                res.json({status: "success", message: "success!", token : token, customer_name: rs[0].customer_name,last_name: rs[0].last_name})
            }else{
                res.json({status: "error", message: "Email or password invalied"})
            }
         }else{
             res.json({status: "error", message: "Email or password invalied"})
         }

    })

})
//========
module.exports = router;
