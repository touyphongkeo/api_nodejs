const express = require("express")
const app = express();
const cors = require("cors")
const expressSanitizer = require("express-sanitizer")
const path = require("path")

//ການກຳນົດພາກສວນເຊືອມຕໍ domain
var corsOption = {
    origin:"*",//["http://tpkeosee.com"],
    optionsSuccessStatus:200
}
app.use(cors(corsOption))

//ການປ້ອງກັນຄວາມບໍຫວັງດີຈາກພາຍນອກ ກ່ຽວກັບ API

app.use(express.json({limit:'3mb'}))
app.use(express.urlencoded({limit:'3mb', extended: true}))
//============


//ການດືງຮູບພາບ ຫຼື  Mas image
app.use("/image", express.static(path.join(__dirname, './uploaded')))
//

//ການເອິນໃຊ້ expresssanitzer
app.use(expressSanitizer())
//==

//ຄຳສັງກວດສອບການແຈ້ງເຕືອນ
app.use(function(err, req, res, next){
    if(err.type == 'entity.too.large'){
        res.status(413).json({message: "You can not send data that is too large"})
        return;
    }
})
//




//ການລິງເຂົ້າຂອງ api
app.use('/api/v1', require('./api/v1/api'))
app.use('/api/v2', require('./api/v2/api'))
//


const server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Running on http://locahost", host,port)
})