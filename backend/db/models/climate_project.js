"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClimateProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClimateProject.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      imgPath: DataTypes.JSON,
      location: DataTypes.JSON,
      locationText: DataTypes.STRING,
      category: DataTypes.STRING,
      timeHorizon: DataTypes.ENUM("kurzfristig", "mittelfristig", "langfristig", "archiv"),
      costs: DataTypes.STRING,
      responsible: DataTypes.STRING,
      link: DataTypes.STRING,
      public: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ClimateProject",
      tableName: "climate_projects",
    },
  );
  return ClimateProject;
};
