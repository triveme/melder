"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("defects", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("defects", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("defects", "createdAt");
    await queryInterface.removeColumn("defects", "updatedAt");
  },
};
