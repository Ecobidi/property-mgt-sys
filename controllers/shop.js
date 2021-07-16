const bcryptjs = require('bcryptjs')
const CartService = require('../services/cart')
const CategoryService = require('../services/category')
const CustomerService = require('../services/customer')
const OrderService = require('../services/order')
const PropertiesService = require('../services/property')

class ShopController {
  static async getShopHome(req, res) {
    let properties
    let categories = await CategoryService.findAll()
    if (req.query.category) {
      properties = await PropertiesService.findByCategory(req.query.category)
    } else if (req.query.search) {
      properties = await PropertiesService.findByName(req.query.search)
    } else {
      properties = await PropertiesService.findAll()
    }
    res.render('shop/shop-home', {categories, properties, layout: 'shop-layout'})
  }

  static async getPropertyDetailPage(req, res) {
    let property = await PropertiesService.findById(req.params.property_id)
    res.render('shop/property-details', { property })
  }

  static async getCartPage(req, res) {
    const customer_name = `${req.session.customer.first_name} ${req.session.customer.last_name}`
    const cart = await CartService.findCart(req.session.customer._id)
    let myCart = { properties: [] }
    if (cart) {
      myCart = {...cart.toObject(), totalPrice: 0}
      myCart.properties.forEach(p => { 
        p.cartQty = myCart.properties_quantities[p._id]
        myCart.totalPrice += p.total = p.price * myCart.properties_quantities[p._id]
      })
    }
    res.render('shop/cart', {cart: myCart, customer_name, layout: 'shop-layout'})
  }

  static async getOrdersPage(req, res) {
    try {
      let orders = await OrderService.findByCustomer(req.session.customer._id)
      console.log(orders[0].properties)
      orders.forEach(o => { 
        o.date_of_order = o.date_of_order.toGMTString()
      })
      res.render('shop/orders', {orders, layout: 'shop-layout'})
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error retrieving all orders')
      res.redirect('/shop')
    }
  }

  static async handleAddToCart(req, res) {
    const property_id = req.query.property_id
    const customer_id = req.session.customer._id
    try {
      const property = PropertiesService.findById(property_id)
      if (!property) throw new Error('No property with such ID as ' + property_id)
      let cartItem = { property_id, quantity: req.query.cart_item_qty}
      await CartService.addItem(cartItem, customer_id)
      res.redirect('/shop/cart')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Failed to add item to cart')
      req.redirect('/shop/cart')
    }
  }

  static async handleRemoveFromCart(req, res) {
    const property_id = req.query.property_id
    const customer_id = req.session.customer._id
    try {
      await CartService.removeItem(property_id, customer_id)
      req.flash('success_msg', 'Item removed from cart')
      res.redirect('/shop/cart')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Failed to remove item from cart')
      req.redirect('/shop/cart')
    }
  }

  static async handleCheckout(req, res) {
    let order_dao = req.body
    order_dao.customer = req.session.customer._id
    order_dao.customer_name = req.session.customer.last_name + " " + req.session.customer.first_name
    try {
      let cart = await CartService.findCart(req.session.customer._id)
      cart = cart.toObject()
      order_dao.properties = cart.properties.map(({_id, title, price}) => ({ _id, title, price }))
      await OrderService.save(order_dao)
      await CartService.clearCart(req.session.customer._id)
      req.flash('success_msg', 'Order successfully placed')
      res.redirect('/shop/orders')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Failed to add item to cart')
      req.redirect('/shop/cart')
    }
  }

  static async getLoginPage(req, res) {
    res.render('shop/login', {layout: 'auth-layout'})
  }

  static async handleLogin(req, res) {
    let dao = req.body
    try {
      let customer = await CustomerService.findByEmail(dao.email)
      if (!customer) {
        req.flash('error_msg', 'Bad sign in credentials')
        return res.redirect('/shop/login')
      }
      let passwordMatch = await bcryptjs.compare(dao.password, customer.password)
      if (passwordMatch == false) {
        req.flash('error_msg', 'Bad sign in credentials')
        return res.redirect('/shop/login')
      }
      req.session.loggedIn = true
      req.session.customer = customer
      res.redirect('/shop')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An Error Occurred!')
      res.redirect('/shop/login')
    }    
  }

  static async getRegisterPage(req, res) {
    res.render('shop/register', {layout: 'auth-layout'})
  }

  static async handleRegister(req, res) {
    let dao = req.body
    if (!dao.password || dao.password != dao.retype_password) {
      req.flash('error_msg', 'Matching Non-Empty Passwords Required')
      return res.redirect('/shop/register')
    }
    try {
      let existingCustomer = await CustomerService.findByEmail(dao.email)
      if (existingCustomer) {
        req.flash('error_msg', 'Email Already Exists!')
        return res.redirect('/shop/register')
      }
      dao.password = await bcryptjs.hash(dao.password, 10)
      await CustomerService.save(dao)
      res.redirect('/shop/login')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An Error Occurred')
      res.redirect('/shop/register')
    }
  }

  static async handleLogout(req, res) {
    req.session.loggedIn = false
    req.session.applicant = null
    res.redirect('/shop/login')
  }

}

module.exports = ShopController