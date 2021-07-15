const mongoose = require('mongoose')

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    default: 1,
  },
  bedrooms: {
    type: Number,
    default: 1,
  },
  size: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  agent_name: {
    type: String
  },
  agent_phone: {
    type: String
  },
  agent_email: String,
  property_mode: {
    type: String,
    enum: ['Sale', 'Rent']
  },
  images: [],
  sold_status: {
    type: Boolean,
    default: false,
  }
})

module.exports = mongoose.model('property', PropertySchema)