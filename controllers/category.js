const CategoryService = require('../services/category')

class CategoryController {

  static async getAllCategories(req, res) {
    let categories
    if (req.query.search && req.query.search.length > 1) {
      categories = await CategoryService.findByName(req.query.search) 
    } else {
      categories = await CategoryService.findAll()
    }
    res.render('categories', { categories })
  }

  static async createCategory(req, res) {
    try {
      await CategoryService.save(req.body)
      req.flash('success_msg', 'Category Added')
      res.redirect('/categories')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error adding category')
      req.redirect('/categories')      
    }
  }

  static async removeCategory(req, res) {
    try {
      await CategoryService.removeOne(req.params.category_id)
      res.redirect('/categories')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/categories')
    }
  }

}

module.exports = CategoryController