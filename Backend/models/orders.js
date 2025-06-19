const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    grand_total: {
        type: Number
    },
    payment_mode: {
        type: String
    },
    order_status: {
        type: String,
        default: 'pending'
    },
    payment_status: {
        type: String,
        default: 'null'
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users' // referencing the users collection
    }
}, {
    timestamps: true // optional
});

module.exports = mongoose.model('orders', ordersSchema);
