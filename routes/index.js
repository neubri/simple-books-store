const express = require('express')
const router = express.Router()
const BookController = require('../controllers/BookController')
const UserController = require('../controllers/UserController')
const routerBooks = require('./books')
// const routerStartUp = require('./startUp')

//GET /register
router.get('/register', UserController.getRegister)

//POST /register
router.post('/register', UserController.postRegister)

//GET /login
router.get('/login', UserController.getLogin)

//POST /login
router.post('/login', UserController.postLogin)

//POST /logout
router.post('/logout', UserController.logout);

router.use(function (req, res, next) {
  console.log(req.session);
  if(!req.session.user.id){ //cek userId session nya ada ga? klo ga ada kasih error suruh login
    const error = 'Please login first!'
    res.redirect(`/login?error=${error}`)
  }else{
    next() //kalo ada userId lanjutt
  }
})

//home
router.get('/', BookController.redirect)

//books
router.use('/books', routerBooks)

// //startup
// router.use('/startUp', routerStartUp)





module.exports = router
