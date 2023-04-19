module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define("report", {
    title: DataTypes.STRING(400),
    link: DataTypes.STRING(400),
    constructionCosts: DataTypes.STRING(400),
    contactPerson: DataTypes.STRING(400),
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
    comment: DataTypes.STRING(400),
    adminComment: DataTypes.STRING(400),
    description: DataTypes.STRING(2100),
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    imgPath: DataTypes.JSON,
    status: DataTypes.ENUM("active", "hidden"),
    lastModifiedBy: DataTypes.INTEGER,
    redirection: DataTypes.JSON,
    address: DataTypes.STRING(400),
  });
  return Report;
};
