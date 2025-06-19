const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
    name: {
        type: String
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    }
}, {
    timestamps: true // optional for createdAt/updatedAt
});

module.exports = mongoose.model('subcategories', subcategorySchema);
