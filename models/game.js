'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Game.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    game_start: DataTypes.DATE,
    game_end: DataTypes.DATE,
    created_by: DataTypes.INTEGER,
    max_players: DataTypes.INTEGER,
    min_level: DataTypes.INTEGER,
    max_level: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};