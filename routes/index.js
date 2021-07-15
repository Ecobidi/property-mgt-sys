const adminRouter = require('express').Router()

const CategoryRouter = require('./category')
const CustomerRouter = require('./customer')
const PropertyRouter = require('./property')
const ShopRouter = require('./shop')
const OrderRouter = require('./order')
const LoginRouter = require('./login')
const UserRouter = require('./user')

const authorization_middleware = (req, res, next) => {
  if (req.session?.user) next()
  else res.redirect('/login')
}

const logout = (req, res) => {
  req.session.user = null
  req.session.loggedIn = false
  res.redirect('/login')
}

adminRouter.use('/login', LoginRouter)

// adminRouter.use(authorization_middleware)

adminRouter.get('/', (req, res) => res.render('dashboard'))

adminRouter.get('/dashboard', (req, res) => res.render('dashboard'))

adminRouter.use('/categories', CategoryRouter)

adminRouter.use('/customers', CustomerRouter)

adminRouter.use('/properties', PropertyRouter)

adminRouter.use('/orders', OrderRouter)

adminRouter.use('/shop', ShopRouter)

adminRouter.use('/users', UserRouter)

adminRouter.get('/logout', logout)

module.exports = adminRouter