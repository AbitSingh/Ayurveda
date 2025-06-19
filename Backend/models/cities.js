const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: false // Sequelize didn't have allowNull: false
    }
});

module.exports = mongoose.model('cities', citySchema);
