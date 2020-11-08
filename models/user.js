'use strict';

const crypto = require('crypto')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // define association here
    }

    validPassword(password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64') === this.password
    }

    toJSON() {
        const {id, username,email, first_name,last_name,date_of_birth, img_url, Roles} = this
        return {
            id,
            username,
            email,
            first_name,
            last_name,
            date_of_birth,
            img_url,
            roles: Roles.map(r => r.toJSON())
        }
    }
  };
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    email: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};