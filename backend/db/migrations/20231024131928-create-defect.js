"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("defects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      location: {
        type: Sequelize.JSON,
      },
      category: {
        type: Sequelize.STRING,
      },
      imgPath: {
        type: Sequelize.JSON,
      },
      description: {
        type: Sequelize.STRING(2100),
      },
      mail: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("defects");
  },
};
