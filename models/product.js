const Sequelize = require('sequelize')

const sequelize = require('../util/database')


const Product = sequelize.define('products', {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    default:100
  },
  title: Sequelize.STRING,
  price: {
    type:Sequelize.DOUBLE,
  },
  imageUrl: {
    type : Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  }
})

module.exports = Product;