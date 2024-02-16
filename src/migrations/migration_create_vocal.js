'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Vocals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      en: {
        type: Sequelize.STRING
      },
      vn: {
        type: Sequelize.STRING
      },
      spelling: {
        type: Sequelize.STRING
      },
      pronunciation: {
        type: Sequelize.STRING
      },
      example_en: {
        type: Sequelize.STRING
      },
      example_vn: {
        type: Sequelize.STRING
      },
      levelId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Vocals');
  }
};