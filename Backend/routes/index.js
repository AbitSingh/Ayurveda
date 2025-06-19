var express = require('express');
var router = express.Router();

var indexController = require('../controllers/indexController');

// Security Purposes
var jwt = require('jsonwebtoken');
var secret_key = 'abcd@#$%1234567890';

router.get('/', indexController.renderHomePage);

router.get('/thankYouPage', indexController.renderThankYouPage);

//router.get('/verify-token', indexController.verifyToken);


module.exports = router;