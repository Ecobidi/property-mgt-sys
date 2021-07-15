const CategoryModel = require('../models/category')

class CategoryService {
  
  static async findByName(name) {
    let pattern = new RegExp(name, 'ig')
    return CategoryModel.find({name: pattern})
  }

  static async findById(id) {
    return CategoryModel.findById(id)
  }
  
  static async findAll() {
    return CategoryModel.find()
  }

  static async save(dao) {
    return CategoryModel.create(dao)
  }

  static async removeOne(id) {
    return CategoryModel.findByIdAndRemove(id)
  }

}

module.exports = CategoryService