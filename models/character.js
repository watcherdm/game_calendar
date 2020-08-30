'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Character.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    class: DataTypes.STRING,
    race: DataTypes.STRING,
    level: DataTypes.INTEGER,
    external_url: DataTypes.STRING,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Character',
  });
  return Character;
};