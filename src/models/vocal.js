'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vocals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vocals.belongsToMany(models.Users, { through: 'UserVocals', foreignKey: 'vocalId' })
    }
  };
  Vocals.init({
    en: DataTypes.STRING,
    vn: DataTypes.STRING,
    spelling: DataTypes.STRING,
    pronunciation: DataTypes.STRING,
    example_en: DataTypes.STRING,
    example_vn: DataTypes.STRING,
    levelId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Vocals',
  });
  return Vocals;
};