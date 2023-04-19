"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Report.init(
    {
      title: DataTypes.STRING,
      link: DataTypes.STRING,
      constructionCosts: DataTypes.STRING,
      contactPerson: DataTypes.STRING,
      location: DataTypes.JSON,
      category: DataTypes.ENUM("Hochbau", "Tiefbau", "Sonstiges"),
      county: DataTypes.ENUM(
        "Dammersbach",
        "Großenbach",
        "Hünfeld",
        "Kirchhasel",
        "Mackenzell",
        "Malges",
        "Michelsrombach",
        "Molzbach",
        "Nüst",
        "Oberfeld",
        "Oberrombach",
        "Roßbach",
        "Rückers",
        "Rudolphshan",
        "Sargenzell"
      ),
      comment: DataTypes.STRING,
      adminComment: DataTypes.STRING,
      description: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      imgPath: DataTypes.JSON,
      status: DataTypes.ENUM("active", "hidden"),
      lastModifiedBy: DataTypes.INTEGER,
      redirection: DataTypes.JSON,
      address: DataTypes.STRING,
      referenceNumber: DataTypes.STRING,
      guid: DataTypes.UUID,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Report",
      tableName: "reports",
    }
  );
  return Report;
};
