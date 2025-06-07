'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Receipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Receipt.belongsTo(models.User);
      Receipt.belongsToMany(models.Book, { through: models.BookReceipt });
    }

  }
  Receipt.init({
    totalPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Receipt',
  });
  return Receipt;
};
