const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")
var privateKey = fs.readFileSync(path.join(__dirname+"/key/private.key"), "utf-8")
var publicKey = fs.readFileSync(path.join(__dirname+"/key/public.key"), "utf-8")
module.exports = {
    sign: (payload) =>{
        var signOption = {
            expiresIn: "24h",
            algorithm: "RS256"
        }
        return jwt.sign(payload, privateKey,signOption)
    },

    verify: (req, res, next) =>{
        var token = req.headers["x-access-token"]
        if(!token){
            return res.status(401).send({
                auth: false,
                message: "No Token Providedd!!"
            })
        }

       var verityOptions = {
        expiresIn: "24h",
        algorithm: "RS256"
       }

       jwt.verify(token,publicKey, verityOptions, function(err, decoded){
           if(err){
               if(err.name == "TokenExpiredError"){
                   return res.status(419).send({
                       auth: false,
                       message: "Token expired!!!!"
                   })
               }

               return res.status(401).send({
                auth: false,
                message: "Failed to Authentication Token!"
               })
               
           }
           req.uuid = decoded.uuid;
           req.email = decoded.email;
           next()
       })

    }
}