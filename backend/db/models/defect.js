"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Defect extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Defect.init(
    {
      location: DataTypes.JSON,
      category: DataTypes.STRING,
      imgPath: DataTypes.JSON,
      description: DataTypes.STRING,
      mail: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Defect",
      tableName: "defects",
    },
  );
  return Defect;
};
