var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var secret_key = 'abcd@#$%1234567890';

var userController = require('../controllers/userController');
const adminController = require("../controllers/adminController");

// function AuthorizeUser(req, res, next){
//     // var token = req.cookies.userToken;
//
//     const token = req.headers.authorization.split(" ")[1]
//         if(!token){
//             // alert("Token Expired. Please Login Again. "); --> We cannot use alert in backend.
//            // res.json({error: true, message: 'Token expired. Please Login Again. ', redirect: "/"})
//             res.json({error: true, message: 'Token expired. Please Login Again. '});
//         } else{
//             try{
//                 var payload = jwt.verify(token, secret_key);
//                 console.log("PayLoad is: ", payload);
//                 req.user = payload;
//                 next();
//             }catch(e){
//                 console.log("Error verifying token:", e);
//                 res.json({error: true, message: 'Token expired. Please Login Again. ', redirect: "/"})
//             }
//         }
// }

function AuthorizeUser(req, res, next) {
    // console.log(req.cookies.UserToken);
    const token = req.headers.authorization.split(" ")[1]

    if (!token) //agar token nahi hai toh seedha login page pe lae jao
    {
        res.json({error: true, message: 'Login Required'});
    } else {
        try //token manually change hua hai yaa nahi verify krna hai
        {
            req.user = jwt.verify(token, secret_key); //data nikalo payload wala
            next();
        } catch (e) {
            res.json({error: true, message: 'Unauthorized Access'});
        }
    }
}

router.post('/login', userController.loginUser);

router.post('/register', userController.registerUser);

router.get('/logout', userController.logoutUser);

router.get('/subcategory/:name', userController.getSubCategoryProducts);

router.get('/showAllProducts', userController.showAllProducts);

// Show all products
// router.get('/products', userController.showAllProducts);

// Show products by subcategory
router.get('/products/:id', userController.showProductsBySubcategory);

router.post('/addToCart/:id', AuthorizeUser, userController.addToCart);

router.get('/openCartPage', userController.openCartPage);

router.get('/getUserCartProducts', userController.getUserCartProducts);

// router.post('/updateCartQuantity', userController.updateCartQuantity);

router.post('/decrementProductQuantity/:id', AuthorizeUser, userController.decrementProductQuantity); 

router.post('/incrementProductQuantity/:id', AuthorizeUser, userController.incrementProductQuantity);

router.delete('/removeProductFromCart/:id', AuthorizeUser, userController.removeProductFromCart);

router.post('/placeOrder', userController.placeOrder);

router.get('/getCities', userController.getCities);

router.get('/thankyoupage', userController.renderThankYouPage);

router.get('/myOrders', AuthorizeUser, userController.getUserOrders);

router.get('/getMyOrders', userController.getMyOrders);

router.post('/bookAppointment', userController.bookAppointment);

router.get('/verify-token', userController.verifyToken);

router.post('/send-success-email', userController.sendSuccessEmail);

router.post('/contact', userController.contactUs);

router.put('/changePassword', userController.changePassword);

router.get('/getProductById/:id', userController.getProductById);

router.post('/forgot-password', userController.forgotPassword);

module.exports = router; 

