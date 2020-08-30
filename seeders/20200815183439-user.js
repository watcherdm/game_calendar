'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
        username: 'watcher',
        password: 'test1234',
        email: 'watcher.gabriel.joshua@gmail.com',
        first_name: 'Gabriel',
        last_name: 'Hernandez',
        date_of_birth: new Date('07/06/1979'),
        img_url: 'img/watcher.png',
        createdAt: new Date(),
        updatedAt: new Date()
    }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
