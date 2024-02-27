const express = require("express")
const router = express.Router()
const { FromBuffer, fromBuffer } = require("file-type")
const { v4: uuidv4 } = require("uuid")//ການຕິດຕັ້ງ npm i uuid
const db = require("../../db")
const moment = require("moment")//ຕ້ອງຕິດຕັ້ງ page  npm i moment
var bcrypt = require('bcryptjs');// npm i bcryptjs
const fs = require("fs")
const getSize = require("image-size-from-base64")

//ການສ້າງ router
router.post("/register",async function(req, res){
let myfileName = "";
if(req.body.imageBase64 && req.body.imageBase64 != ""){

    var fileSize = await getSize(req.body.imageBase64)//KB

    if(fileSize > 10240){
        res.status(400).json({message: "File is large than 10mb"})
        return;
    }


    myfileName = await base64ToImage(req.body.imageBase64)

}

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


async function base64ToImage(data){
    let fileExt = await(getExtImage(data))
    var myfileName = uuidv4() + "." + fileExt

    fs.writeFile("./uploaded/"+ myfileName, data, 'base64', function(err){
        if(err){
            console.log(err)
            myfileName = ""
        }
    })
return myfileName


}

async function getExtImage(data){
    const ext = await fromBuffer(Buffer.from(data, 'base64'))
    return ext.ext;
}





//========
module.exports = router;