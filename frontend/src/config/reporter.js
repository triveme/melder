import { CATEGORY_NAMES } from "../constants";

export const categories = {
  all: "Alle",
  default: CATEGORY_NAMES.BUILDING,
  others: [
    CATEGORY_NAMES.UNDERGROUND,
    CATEGORY_NAMES.OTHER
  ],
};

export const reporter = {
  steps: [
    {
      label: "Standort / Strecke",
      descriptionMarker: "Wollen Sie einen Standort oder eine Strecke markieren?",
      options: [
        { name: "Standort", icon: "pin" },
        { name: "Strecke", icon: "line" },
      ],
    },
    {
      label: "Position wählen",
      descriptionMarker: "Durch Verschieben der Karte können Sie die Position Ihrer Meldung bestimmen.",
      descriptionMarkers:
        "Durch Klicken auf die Karte können Sie neue Marker der Strecke hinzufügen. Die Marker können per Drag & Drop angepasst werden.",
      alertText: "Zu weit von Hünfeld entfernt",
    },
    {
      title: "Titel",
      constructionCosts: "Konstruktionskosten",
      contactPerson: "Kontaktperson",
      link: "Verlinkung",
      titlePlaceholder: "Meldungstitel",
      label: "Ereignis beschreiben",
      category: "Kategorie",
      categories: {
        default: categories.default,
        others: categories.others,
      },
      counties: {
        default: "Hünfeld",
        others: [
          "Dammersbach",
          "Großenbach",
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
          "Sargenzell",
        ],
      },
      county: "Stadtteil",
      description: "Beschreibung (max. 2000 Zeichen)",
      descriptionPlaceholder: "Beschreibung des Ereignisses (z. B. nähere Orts- und Zeitangaben)",
      descriptionMaxChars: 2000,
      startDate: "Start *",
      endDate: "Ende *",
      time: "Uhrzeit (ca.)",
      pictureUpload: "Bild(er) hochladen (optional):",
      pictureChange: "Bild(er) bearbeiten (optional):",
      pictureRemove: "Bild löschen",
      redirection: "Umleitung hinzufügen",
      feedback:
        "Für eine Rückmeldung zur Freigabe können Sie ihre E-Mail-Adresse eingeben (sie wird nicht öffentlich angezeigt).",
    },
    {
      label: "Meldung absenden",
      accept: "Durch einen Klick auf 'Senden' wird die Meldung gesendet.",
      acceptEdit: "Durch einen Klick auf 'Bearbeiten' wird die Meldung unwiederruflich bearbeitet.",
    },
  ],
  finalStep: {
    thanks: "Die Meldung wurde erfolgreich angelegt!",
  },
  continue: "Weiter",
  back: "Zurück",
  cancel: "Abbrechen",
  send: "Senden",
  edit: "Bearbeiten",
  close: "Schliessen",
  default: {
    idIfEdit: null,
    activeStep: -1,
    categoryValue: categories.default,
    comment: "",
    adminComment: "",
    descriptionValue: "",
    startDateValue: null,
    endDateValue: null,
    userMarkerPosition: [],
    captchaSolved: false,
    images: [],
    countyValue: "Hünfeld",
    lineCoordinates: [],
    locationOption: "Standort",
    newRedirection: [],
    hasRedirection: false,
    title: "",
    link: "",
    contactPerson: "",
    constructionCosts: "",
  },
};
