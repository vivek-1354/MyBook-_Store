const Sequelize = require("sequelize");

const sequelize = new Sequelize("my-book-store", "root", "vvkGPT**1995", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
