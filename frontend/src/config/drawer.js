const drawer = {
  default: "/melder",
  content: [
    {
      title: "Hifäller Projekte",
      url: "/melder",
      icon: "map",
      authRequired: false,
    },
    {
      title: "Mängelmelder",
      url: "/maengel",
      icon: "pin",
      authRequired: false,
    },
    {
      title: "Meldungen",
      url: "/meldungen",
      icon: "list",
      authRequired: true,
    },
    {
      title: "Informationen",
      url: "/info",
      icon: "info",
      authRequired: false,
    },
    {
      title: "Administration",
      url: "/admin",
      icon: "build",
      authRequired: true,
    },
  ],
  width: 250,
};

export default drawer;
