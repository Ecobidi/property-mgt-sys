let express = require('express')
require('dotenv').config()
let expressSession = require('express-session')
let fileupload = require('express-fileupload')
let connectFlash = require('connect-flash')
let mongoose = require('mongoose')

let { APPNAME, PORT, dbhost, dbport, dbname, sessionsecret, domain, owner_mat_no, owner_name} = require('./config') 

// routes
const routes = require('./routes')

// connect to mongodb database
mongoose.connect(`mongodb://${dbhost}:${dbport}/${dbname}`)

// init express App
let app = express()

// view engine 
app.set('view engine', 'ejs')
app.set('views', './views')

// expressStatic
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/uploads'))

// bodyparser middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use(fileupload())

// express-session middleware
app.use(expressSession({
  secret: sessionsecret,
  saveUninitialized: true,
  resave: true,
}))
app.use(connectFlash())

app.use((req, res, next) => {
  req.session.customer = {
    "_id" : "60ef9ef89c891629dc0f66a0",
    "email" : "customer1@email.com",
    "first_name" : "Chinonso",
    "last_name" : "Ezeh",
    "password" : "$2a$10$m4GyMcUJVsDuCXvYAWLLJ.dsz4BCCcMzlf5QvMpqAAD0LFg1FFvtS",
    "__v" : 0
}

  res.locals.error_msg = req.flash('error_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.user = req.session.user
  app.locals.owner_name = owner_name
  app.locals.owner_mat_no = owner_mat_no
  app.locals.appname = APPNAME
  app.locals.port = PORT
  app.locals.domain = domain + ':' + PORT
  next()
})

// routes

// app.get('/logout', (req, res) => {
//   req.session.loggedIn = false
//   req.session.username = ''
//   res.redirect('/login')
// })

// let getDashboard = async (req, res) => {
//   try {
//     let airports_count = await AirportModel.count()
//     let customers_count = await CustomerModel.count()
//     let flights_count = await FlightModel.count()
//     let tickets_count = await TicketModel.count()
//     let users_count = await UserModel.count()
//     res.render('dashboard', {airports_count, flights_count, tickets_count, users_count})
//   } catch (err) {
//     console.log(err)
//     res.render('dashboard', {
//       flights_count: 0,
//       airports_count: 0, tickets_count: 0, users_count: 0,
//     })
//   }
// }

app.use('/', routes)

app.listen(PORT, () => { console.log(`${APPNAME} running on port ${PORT}`) })