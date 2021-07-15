const router = require('express').Router()
const CategoryController = require('../controllers/category')

router.get('/', CategoryController.getAllCategories)

router.post('/new', CategoryController.createCategory)

router.get('/remove/:category_id', CategoryController.removeCategory)

module.exports = router