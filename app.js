const express = require('express')
const app = express()
const router = require('./routes/index')
const session = require('express-session')
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: 'rahasia brok', //harus ada
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true //untuk security dari csrf attach
  } //https
}))

app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
