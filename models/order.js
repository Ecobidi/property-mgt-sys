let mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
  },
  customer_name: {
    type: String,
  },
  contact_address: String,
  contact_phone: String,
  properties: [],
  date_of_order: {
    type: Date,
    default: Date.now,
  },
  payment_type: {
    type: String,
    enum: ['Cash', 'Debit Card'],
    default: 'Debit Card'
  },
  card_num: String,
  card_cvv: String,
  order_status: {
    type: String, 
    enum: ['cancelled', 'in-progress', 'sold'],
    default: 'in-progress'
  },
});

module.exports = mongoose.model("order", orderSchema);