const PropertyModel = require('../models/property')

class PropertyService {

  static async findById(id) {
    return PropertyModel.findById(id)
  }

  static async findByTitle(title) {
    let pattern = new RegExp(title, 'ig')
    return PropertyModel.find({title: pattern})
  }
  
  static async findAll(params = {}) {
    return PropertyModel.find(params)
  }

  static async save(dao) {
    return PropertyModel.create(dao)
  }

  static async removeOne(id) {
    return PropertyModel.findByIdAndRemove(id)
  }

}

module.exports = PropertyService