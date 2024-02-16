'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('VocalList', [
      {
        en: "variable",
        vn: "Biến số",
        spelling: "/verēəb(ə)l/",
        example_en: "what is the variable ?",
        example_vn: "variable là gì ?",
        langueId: 1
      },
      {
        en: "function",
        vn: "hàm",
        spelling: "/verēəb(ə)l/",
        example_en: "what is the function ?",
        example_vn: "function là gì ?",
        langueId: 1
      },
      {
        en: "number",
        vn: "số nguyên",
        spelling: "/verēəb(ə)l/",
        example_en: "what is the number ?",
        example_vn: "number là gì ?",
        langueId: 1
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
