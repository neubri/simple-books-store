# Simple Bookstore App

A simple web application for managing books, categories, users, and invoices. Built with Node.js, Express, Sequelize, and EJS.

## Features

- User registration & login
- CRUD for books & categories
- Book purchase & invoice generation
- Data stored in PostgreSQL via Sequelize ORM

## Project Structure

```
app.js                # Main application file
config/               # Database configuration
controllers/          # Route controllers
models/               # Sequelize models
routes/               # Express routes
views/                # EJS templates
migrations/           # Sequelize migrations
seeders/              # Initial data seeding
helpers/              # Utility functions
```

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd books-store-app
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure the database**
   - Edit `config/config.json` with your PostgreSQL credentials.
   - Create the database manually or using Sequelize CLI.
4. **Run migrations & seeders**
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
5. **Start the application**
   ```bash
   npm start
   # or
   node app.js
   ```
6. **Access the app**
   - Open your browser and go to `http://localhost:3000`

## Usage

- Register/login as a user
- Add, edit, or delete books and categories
- Purchase books and view invoices

## Dependencies

- express
- sequelize
- pg
- ejs
- bcryptjs
- express-session
- easyinvoice

## License

MIT

# simple-books-store
