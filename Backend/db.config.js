const mongoose = require('mongoose');
const db = {};

// Connect to MongoDB
const dbName = 'ayurveda';
const dbUrl = `mongodb://localhost:27017/${dbName}`;

mongoose.connect(dbUrl)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Load models
db.mongoose = mongoose;
db.admin = require('./models/Admin.js');
db.user = require('./models/User.js');
db.subcategory = require('./models/subcategories.js');
db.category = require('./models/categories.js');
db.product = require('./models/product.js');
db.orderDetails = require('./models/orderDetails.js');
db.cities = require('./models/cities.js');
db.orders = require('./models/orders.js');
db.appointments = require('./models/appointments.js');
db.contacts = require('./models/contacts.js');

module.exports = db;
