const express = require("express")
const router = express.Router()
const multer = require("multer")//ການຕິດຕັ້ງ npm i multer
const { v4: uuidv4 } = require("uuid")//ການຕິດຕັ້ງ npm i uuid
const path = require("path")
const db = require("../../db")
const moment = require("moment")//ຕ້ອງຕິດຕັ້ງ page  npm i moment
var bcrypt = require('bcryptjs');// npm i bcryptjs
//ການສ້າງ router
router.post("/register", function (req, res) {
    // res.send("Hello World register V1")
    let myfileName = "";
    const storng = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploaded')
        },
        filename: function (req, file, cb) {
            myfileName = uuidv4() + path.extname(file.originalname)//92499JKDSDDJJ.JPG
            cb(null, myfileName)
        }
    })

    const upload = multer({ storage: storng, limits: { fileSize: 10485760 } }).single("myFile")
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code == "LIMIT_FILE_SIZE") {
                res.status(400).json({ message: "File is large than 2 mb" })
            }

        } else if (err) {
            res.status(400).json({ message: "Upload file is error" })
        }

      //  res.json({ message: "Upload success" })


        const uuid = uuidv4()
        const customer_name = req.sanitize(req.body.customer_name)
        const last_name = req.sanitize(req.body.last_name)
        const address = req.sanitize(req.body.address)
        const tel = req.sanitize(req.body.tel)
        const email = req.sanitize(req.body.email)
        const password = bcrypt.hashSync(req.body.password, 10)//req.sanitize(req.body.password)
        const image = myfileName
        const created_date = moment().format("YYYY-MM-DD H:m:s")

        //insert into tbl_customer
        let sql = "insert into tbl_customer(uuid, customer_name, last_name, address, tel, email, password, image, created_date) VALUES ?"
        let values = [[
            uuid,
            customer_name,
            last_name,
            address,
            tel,
            email,
            password,
            image,
            created_date
        ]]

        db.query(sql, [values], function(err,  rs){
            if(err) throw err;
            res.json({status: "success",message: "Add Data Success!"})
        })
        

    })



    
})
//========
module.exports = router;