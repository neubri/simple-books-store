'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Category);
      Book.belongsToMany(models.Receipt, { through: models.BookReceipt });
    }

    get infoStock() {
      if(this.stock === 0){
        return `❌ Maaf stock habis : ${this.stock}`
      }else if (this.stock <= 3){
        return `⚠️ Stok menipis : ${this.stock}`;
      }else{
        return this.stock
      }
    }

    static async getBookDetail(id) {
      return await this.findByPk(id, {
        include: [{
          model: sequelize.models.Category,
          attributes: ['id', 'name']
        }]
      });
    }
  }

  Book.init({
    title: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg: "Title is required!"
        },
        notNull : {
          msg: "Title is required!"
        }
      }
    },
    description: {
      type : DataTypes.TEXT,
      allowNull : false,
      validate : {
        notEmpty : {
          msg: "Description is required!"
        },
        notNull : {
          msg: "Description is required!"
        }
      }
    },
    price: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : {
          msg: "Price is required!"
        },
        notNull : {
          msg: "Price is required!"
        },
        min : {
          args : 1,
          msg : "Price must be greater than 0"
        }
      }
    },
    stock: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : {
          msg: "Stock is required!"
        },
        notNull : {
          msg: "Stock is required!"
        },
        min : {
          args : 1,
          msg : "Stock must be greater than 0"
        }
      }
    },
    coverUrl: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg: "Cover is required!"
        },
        notNull : {
          msg: "Cover is required!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};
