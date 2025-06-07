// models/receipt.js
module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define('Receipt', {
    totalPrice: DataTypes.INTEGER,
    invoicePdf: DataTypes.TEXT // Untuk menyimpan PDF base64
  });

  Receipt.associate = models => {
    Receipt.belongsTo(models.User);
    Receipt.belongsToMany(models.Book, { through: 'BookReceipt' });
  };

  return Receipt;
};

// models/bookreceipt.js
module.exports = (sequelize, DataTypes) => {
  const BookReceipt = sequelize.define('BookReceipt', {
    quantity: DataTypes.INTEGER
  });

  return BookReceipt;
};
