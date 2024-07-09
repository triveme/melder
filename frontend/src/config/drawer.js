const drawer = {
  default: "/melder",
  content: [
    {
      title: "Hifäller Projekte",
      url: "/melder",
      icon: "construction",
      authRequired: false,
    },
    {
      title: "Klimaaktionsplan",
      url: "/klima",
      icon: "spa",
      authRequired: false,
    },
    {
      title: "Mängelmelder",
      url: "/maengel",
      icon: "notificationImportant",
      authRequired: false,
    },
    {
      title: "Sensordaten",
      url: "/sensor",
      icon: "sensors",
      authRequired: "sensor_perm",
    },
    {
      title: "Informationen",
      url: process.env.REACT_APP_INFO_URL,
      icon: "info",
      authRequired: false,
    },
    {
      title: "Meldungen",
      url: "/meldungen",
      icon: "list",
      authRequired: true,
    },
    {
      title: "Nutzerverwaltung",
      url: "/nutzer",
      icon: "manageAccounts",
      authRequired: "admin_perm",
    },
  ],
  width: 250,
};

export default drawer;
