
var indexController = {};

var jwt = require('jsonwebtoken');
var secret_key = 'abcd@#$%1234567890';

indexController.renderHomePage = (req, res) =>{
    res.render('index/index-2')
}

indexController.renderThankYouPage = (req, res) =>{
    console.log("Inside renderThankYouPage controller");
    res.render('index/thankYouPage')
}

// indexController.verifyToken = (req, res)=>{
//     var token = req.cookies.userToken;
//
//     if(!token){
//         // Jab bhi res.redirect likhe gai toh sara path shuru sai e dena hai.
//         // res.redirect('/admin');
//         res.json({error: "true", message: "You are not logged in"});
//     }else{
//         try{
//             var payload = jwt.verify(token, secret_key);
//             console.log("Payload is: ", payload);
//             req.user = payload;
//             res.json({error: "false", message: "Token verified"});
//         }catch(e){
//             //alert("Please Login First");
//             console.log("Error verifying token:", e);
//             res.json({error: "true", message: "You are not logged in"});
//         }
//     }
// }
module.exports = indexController;