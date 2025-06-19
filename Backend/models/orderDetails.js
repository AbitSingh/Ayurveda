const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetailsSchema = new Schema({
    productId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'products', // Reference to 'products' collection
    },
    quantity: {
        type: Number
    },
    oldPrice: {
        type: Number
    },
    newPrice: {
        type: Number
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users' // Reference to 'users' collection
    },
    orderId: {
        type:  mongoose.Schema.Types.ObjectId,
        default: null
    },
    discount: {
        type: Number
    },
    status: {
        type: String,
        default: 'pending'
    }
}, {
    timestamps: true // optional, if you want createdAt/updatedAt
});

module.exports = mongoose.model('orderdetails', orderDetailsSchema);
