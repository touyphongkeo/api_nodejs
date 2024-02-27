//page ການເຊື່ອມໂຍງຖານຂໍ້ມູນ  npm i mysql
var mysql = require("mysql")
var connection = mysql.createPool({
    connectionLimit: 10000,
    host: "163.44.198.59",
    user: "cp744062_appos",
    password: "cp744062_appos",
    port: 3306,
    database: "cp744062_appos"

})
module.exports = connection;
//
