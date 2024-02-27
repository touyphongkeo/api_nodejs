const express = require("express")
const router = express.Router()
const db = require("../../db")
const jwt = require("../../jwt")
const multer = require("multer")//ການຕິດຕັ້ງ npm i multer
const { v4: uuidv4 } = require("uuid")//ການຕິດຕັ້ງ npm i uuid
const path = require("path")
const moment = require("moment")//ຕ້ອງຕິດຕັ້ງ page  npm i moment
var bcrypt = require('bcryptjs');// npm i bcryptjs
var rateLimit = require("express-rate-limit")//npm i express-rate-limit
const { resolve } = require("path")

const appLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15
    max: 3,
    message: "Too many reqests, please try again later !"
})



router.get("/customer/list", appLimiter, jwt.verify, function (req, res) {
    console.log(req.uuid)
    console.log(req.email)

    let sql = "SELECT uuid,customer_name,last_name,address,tel,email,image FROM tbl_customer ORDER BY created_date DESC"
    db.query(sql, function (err, rs) {
        if (err) throw err
        res.json(rs)
    }) 
})




//ຄຳສັງອັບເດດຂໍ້ມູນ
router.post("/customer/update", jwt.verify, function (req, res) {
    let myfileName = "";
    const storng = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploaded')
        },
        filename: function (req, file, cb) {
            myfileName = uuidv4() + path.extname(file.originalname) //92499JKDSDDJJ.JPG
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


        const uuid = req.sanitize(req.body.uuid)
        const customer_name = req.sanitize(req.body.customer_name)
        const last_name = req.sanitize(req.body.last_name)
        const address = req.sanitize(req.body.address)
        const tel = req.sanitize(req.body.tel)
        const email = req.sanitize(req.body.email)
        const password = bcrypt.hashSync(req.body.password, 10)//req.sanitize(req.body.password)
        const image = myfileName
        const created_date = moment().format("YYYY-MM-DD H:m:s")

        //update into tbl_customer
        let sql = "UPDATE tbl_customer SET ? WHERE uuid = ?"
        let values = {
            "customer_name": customer_name,
            "last_name": last_name,
            "address": address,
            "tel": tel,
            "email": email,
            "password": password,
            "created_date": created_date
        }

        //ຄຳສັງກວດສອບຮູບພາບ
        let uploadImage = {
            "image": image
        }

        if (myfileName != "") {
            //merge
            values = { ...values, ...uploadImage }
        }
        db.query(sql, [values, uuid], function (err, rs) {
            if (err) throw err;
            res.json({ status: "success", message: "Update Data Success!" })
        })

    })


})


//off


//ການລົບຂໍ້ມູນ
router.post("/customer/delete", jwt.verify, function (req, res) {
    const uuid = req.sanitize(req.body.uuid)
    let sql = "DELETE FROM tbl_customer WHERE uuid = ?"
    db.query(sql, [uuid], function (err, rs) {
        if (err) throw err
        res.json({ status: "success", message: "Delete Successfuly" })
    })
})

//ການດືງຂໍ້ມູນມາສະແດງແບບມີເງືອນໄຂ

router.get("/customer/:uuid", jwt.verify, function (req, res) {
    const uuid = req.sanitize(req.params.uuid)
    //  const id = req.sanitize(req.params.id)
    let sql = `SELECT uuid,customer_name,last_name,address,tel,email,image FROM tbl_customer 
    WHERE uuid = ?`
    db.query(sql, [uuid], function (err, rs) {
        if (err) throw err
        if (rs.length > 0) {
            res.json(rs[0])
        } else {
            res.json({ status: "Error", message: "Not found" })
        }

    })
})


//

router.get("/customer/list/promise", appLimiter, jwt.verify, async function (req, res) {
    let data = []
    data = await getData();
    let productItem = await getDataproduct();
    res.json({
        customer: data,
        product: productItem
        
    })
})

function getData() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT uuid,customer_name,last_name,address,tel,email,image FROM tbl_customer ORDER BY created_date DESC"
        db.query(sql, function (err, rs) {
            if (err){
                reject("Error")
            }
           resolve(rs)
        })
    })
}




function getDataproduct() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT uuid,customer_name,last_name,address,tel,email,image FROM tbl_customer ORDER BY created_date DESC"
        db.query(sql, function (err, rs) {
            if (err){
                reject("Error")
            }
           resolve(rs)
        })
    })
}

//








module.exports = router;