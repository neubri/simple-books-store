const express = require('express');
const BookController = require('../controllers/BookController');
const router = express.Router();

// READ: List semua buku
router.get('/', BookController.books);

// BUY: Available for all authenticated users
router.post('/buy/:id', BookController.buyBook);

// PDF Generation: Available for all authenticated users
router.post('/generate-pdf', BookController.generateInvoicePDF);

// Admin-only middleware
router.use(function (req, res, next) {
  console.log(req.session);
  if(req.session.user.role !== 'admin'){ //cek userId session nya ada ga? klo ga ada kasih error suruh login
    const error = 'You Have No Access!'
    res.redirect(`/login?error=${error}`)
  }else{
    next() //kalo ada userId lanjutt
  }
})

// ADMIN ONLY routes below this middleware
// CREATE: Form tambah buku & simpan
router.get('/add', BookController.getAddBooks);
router.post('/add', BookController.postAddBooks);

// UPDATE: Form edit buku & update data
router.get('/edit/:id', BookController.getEditBooks);
router.post('/edit/:id', BookController.postEditBooks);

// DELETE: Hapus buku
router.get('/delete/:id', BookController.deleteBook);

module.exports = router;
