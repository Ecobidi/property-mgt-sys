const CategoryService = require('../services/category')
const PropertyService = require('../services/property')

// const gstorage = new Storage()

// gstorage.bucket('')



class PropertyController {

  static async getAllProperties(req, res) {
    let properties
    if (req.query.search) {
      properties = await PropertyService.findAll(req.query.search)
    } else {
      properties = await PropertyService.findAll()
    }
    res.render('properties', { properties })
  }

  static async getCreatePropertyPage(req, res) {
    try {
      let categories = await CategoryService.findAll()
      res.render('properties-new', { categories })
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error navigating to create property page')
      req.redirect('/properties')
    }
  }

  // static async createProperty(req, res) {
  //   console.log('hello')
  //   console.log(req.file)
  //   console.log(req.files)
  //   console.log(req.body)
  //   // console.log(req.file)
  //   // console.log(req.body)
  //   // console.log(req.files)
  //   // try {
  //   //   await PropertyService.save(req.body)
  //   //   req.flash('success_msg', 'Property Created')
  //   //   res.redirect('/properties')
  //   // } catch (error) {
  //   //   console.log(error)
  //   //   req.flash('error_msg', 'Error creating property')
  //   //   req.redirect('/properties')      
  //   // }
  // }

  static async removeProperty(req, res) {
    try {
      await PropertyService.removeOne(req.params.property_id)
      res.redirect('/properties')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/properties')
    }
  }

}

module.exports = PropertyController