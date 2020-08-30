'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Roles', [{
        name: 'admin',
        img_url: 'img/admin.png',
        createdAt: new Date(),
        updatedAt: new Date()
    },{
        name: 'chapter',
        img_url: 'img/chapter.png',
        createdAt: new Date(),
        updatedAt: new Date()
    }, {
        name: 'player',
        img_url: 'img/player.png',
        createdAt: new Date(),
        updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});

  }
};
