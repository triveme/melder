"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
      constructionCosts: {
        type: Sequelize.STRING,
      },
      contactPerson: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.JSON,
      },
      category: {
        type: Sequelize.ENUM,
        values: ["Hochbau", "Tiefbau", "Sonstiges"],
      },
      county: {
        type: Sequelize.ENUM,
        values: [
          "Dammersbach",
          "Großenbach",
          "Hünfeld",
          "Kirchhasel",
          "Mackenzell",
          "Malges",
          "Michelsrombach",
          "Molzbach",
          "Nüst",
          "Oberfeld",
          "Oberrombach",
          "Roßbach",
          "Rückers",
          "Rudolphshan",
          "Sargenzell",
        ],
      },
      comment: {
        type: Sequelize.STRING,
      },
      adminComment: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      imgPath: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "hidden"],
      },
      lastModifiedBy: {
        type: Sequelize.INTEGER,
      },
      redirection: {
        type: Sequelize.JSON,
      },
      address: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reports");
  },
};
