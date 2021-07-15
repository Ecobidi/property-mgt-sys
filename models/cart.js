const mongoose = require('mongoose')

let CartSchema = mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    unique: true,
  },
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'property'
  }],
  properties_quantities: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
})

module.exports = mongoose.model('cart', CartSchema)