const { User } = require('../models')
const bcrypt = require('bcryptjs')

class UserController {

  static async getRegister(req, res){

    res.render('auth-pages/register')
  }

  static postRegister(req, res){
    //create user baru yang isi nya username email password role
      const { username, email,password, role } = req.body

      User.create({ username, email,password, role })
        .then(newUser => {
          res.redirect('/login')
        })
        .catch(err => res.send(err))
  }

  static getLogin(req, res){

      const { error } = req.query

      res.render('auth-pages/login', { error })

  }

  static async postLogin(req, res){
    //apakah dari username dan password yang input user nya ada?
    //1. findOne User dari username
    //2. kalo user ada, compare plain password apakah sama dengan hash password
    //2.1 kalo user ga ada, ga boleh masuk ke home keluar error
    //2.2 kalo ga sama tidak bolhe masuk ke home / keluar error
    //3. kalo password sesuai, maka redirect ke home
      const { username, password } = req.body

      await User.findOne({ where : {username} })
        .then(user => {
          if(user){
            const isValidPassword = bcrypt.compareSync(password, user.password) //true or false

              if(isValidPassword){ //case berhasil login

                req.session.user = {id: user.id, role: user.role, username: user.username}//set session di controller login

                return res.redirect('/')
              }else{
                const error = "Invalid Username or Password"
                return res.redirect(`/login?error=${error}`)
              }

          }else{
            const error = "Invalid Username or Password"
            return res.redirect(`/login?error=${error}`)
          }
        })
        .catch(err => res.send(err))
  }

  static async logout(req, res) {
    try {
      req.session.destroy();
      res.redirect('/login');
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = UserController
