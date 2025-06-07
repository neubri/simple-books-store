const { Book, Category } = require('../models')
const easyinvoice = require('easyinvoice');
const { Op } = require('sequelize');
const { formatRupiah } = require('../helpers/helper')

class BookController {
  static async redirect(req, res){
    try {
      res.redirect('/books')
    } catch (error) {
      res.send(error)
    }
  }

  static async books(req, res){
    try {
      const { search,  deleted, error  } = req.query;

      // Base options
      const opt = {
        include: Category
      };

      // Add search condition if search query exists
      if(search) {
        opt.where = {
          title: {
            [Op.iLike]: `%${search}%`
          }
        };
      }

      let books = await Book.findAll(opt);

      // Add infoStock property to each book
      books = books.map(book => {
        const bookData = book.toJSON();
        bookData.infoStock = book.stock > 0 ? `${book.stock} tersedia` : 'Habis';
        return bookData;
      });

      res.render('books', {formatRupiah,
        books,
        deleted,  // Kirim parameter deleted ke view
        error,
        user: req.session.user,
        searchQuery: search // Pass search query back to view
      });
    } catch (error) {
      res.send(error)
    }
  }

  static async getAddBooks(req, res){
    try {
      const categories = await Category.findAll();
      res.render('addBooks', { categories });
    } catch (error) {
      res.send(error);
    }
  }

  static async postAddBooks(req, res){
    try {
      const { title, description, price, stock, coverUrl, CategoryId } = req.body;
      await Book.create({ title, description, price, stock, coverUrl, CategoryId });
      res.redirect('/books');
    } catch (error) {
      res.send(error);
    }
  }

  static async getEditBooks(req, res) {
    try {
      const { id } = req.params;
      // Menggunakan static method getBookDetail
      const book = await Book.getBookDetail(id);
      const categories = await Category.findAll();

      if (!book) {
        return res.send('Book not found');
      }

      res.render('editBooks', { book, categories });
    } catch (error) {
      res.send(error);
    }
  }

  static async postEditBooks(req, res) {
    try {
      const { id } = req.params;
      const { title, description, price, stock, coverUrl, CategoryId } = req.body;
      await Book.update(
        { title, description, price, stock, coverUrl, CategoryId },
        { where: { id } }
      );
      res.redirect('/books');
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteBook(req, res) {
    try {
      const id = +req.params.id;
      const book = await Book.findByPk(id, {
        include: Category
      });

      if (!book) {
        return res.redirect('/books?error=Book not found');
      }

      await book.destroy();

      // Kirim notifikasi dengan format: "JudulBuku-KategoriBuku"
      res.redirect(`/books?deleted=${book.title}-${book.Category.name}`);
    } catch (error) {
      res.redirect('/books?error=' + encodeURIComponent(error.message));
    }
  }

  static async buyBook(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id, {
        include: Category
      });

      if (!book) {
        return res.redirect('/books?error=Book not found');
      }

      if (book.stock <= 0) {
        return res.redirect('/books?error=Book out of stock');
      }

      // Decrement stock
      await Book.decrement('stock', { where: { id } });

      // Get updated book data
      const updatedBook = await Book.findByPk(id, {
        include: Category
      });

      // Generate invoice data
      const invoiceData = {
        book: updatedBook,
        user: req.session.user,
        purchaseDate: new Date(),
        invoiceNumber: `INV-${Date.now()}-${id}`,
        total: updatedBook.price
      };

      res.render('invoice', {
        ...invoiceData,
        formatRupiah
      });

    } catch (error) {
      res.redirect('/books?error=' + encodeURIComponent(error.message));
    }
  }

  // Method untuk generate PDF invoice (opsional)
  static async generateInvoicePDF(req, res) {
    try {
      const { bookId, invoiceNumber } = req.body;
      const book = await Book.findByPk(bookId, {
        include: Category
      });

      const data = {
        "documentTitle": "INVOICE",
        "currency": "IDR",
        "taxNotation": "vat",
        "marginTop": 25,
        "marginRight": 25,
        "marginLeft": 25,
        "marginBottom": 25,
        "logo": "https://via.placeholder.com/150x50/000000/FFFFFF?text=BOOKSTORE",
        "sender": {
          "company": "Online Bookstore",
          "address": "Jakarta, Indonesia",
          "zip": "12345",
          "city": "Jakarta",
          "country": "Indonesia"
        },
        "client": {
          "company": req.session.user.username,
          "address": "Customer Address",
          "zip": "12345",
          "city": "Jakarta",
          "country": "Indonesia"
        },
        "invoiceNumber": invoiceNumber,
        "invoiceDate": new Date().toLocaleDateString('id-ID'),
        "products": [
          {
            "quantity": "1",
            "description": book.title,
            "tax": 0,
            "price": book.price
          }
        ],
        "bottomNotice": "Thank you for your purchase!"
      };

      const result = await easyinvoice.createInvoice(data);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceNumber}.pdf`);
      res.send(Buffer.from(result.pdf, 'base64'));

    } catch (error) {
      res.redirect('/books?error=' + encodeURIComponent(error.message));
    }
  }
}

module.exports = BookController
