"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("climate_projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
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
      location: {
        type: Sequelize.JSON,
      },
      locationText: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      timeHorizon: {
        type: Sequelize.ENUM,
        values: ["kurzfristig", "mittelfristig", "langfristig", "archiv"],
      },
      costs: {
        type: Sequelize.STRING,
      },
      responsible: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
      public: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("climate_projects");
  },
};
