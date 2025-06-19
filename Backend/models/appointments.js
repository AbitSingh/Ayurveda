const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// IST time offset function
const getISTDate = () => {
  const date = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC + 5:30
  return new Date(date.getTime() + istOffset);
};

const appointmentSchema = new Schema({
  name: {
    type: String
  },
  phone: {
    type: String
  },
  message: {
    type: String
  },
  subject: {
    type: String
  },
  date: {
    type: Date,
    default: getISTDate
  },
  userId: {
    type: Schema.Types.ObjectId,   // <== ✅ this is important
    ref: 'users',                  // <== link to users collection (model name)
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: getISTDate
  },
  updatedAt: {
    type: Date,
    default: getISTDate
  }
});

module.exports = mongoose.model('appointments', appointmentSchema);
