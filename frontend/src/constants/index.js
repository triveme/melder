import colors from "../theme/colors";
import tiefbauarbeiten from "../assets/images/categories/Tiefbauarbeiten.jpg";
import muelleimervoll from "../assets/images/categories/Mülleimer.jpg";
import parkplaetze from "../assets/images/categories/Parkhaus.jpg";
import vandalismus from "../assets/images/categories/Vandalismus.jpg";
import wildeMuellablagerungen from "../assets/images/categories/WildeMüllablagerung.jpg";
import hochbau from "../assets/images/categories/Hochbau.jpg";
import spielplatz from "../assets/images/categories/Spielplatz.jpg";
import beschilderung from "../assets/images/categories/Beschilderung.JPG";
import buergerhaeuser from "../assets/images/categories/buergerhaeuser.JPG";
import gewaesser from "../assets/images/categories/Gewässer.jpg";
import strassenschaden from "../assets/images/categories/Straßenschaden.jpg";
import wcanlagen from "../assets/images/categories/WC_Anlagen.JPG";
import sonstiges from "../assets/images/categories/Cat_sonstiges_light.svg";

export const FILTERNAME_CATEGORY_NAMES = [
  {
    name: "Kategorie",
    filterName: "category",
  },
  {
    name: "Status",
    filterName: "state",
  },
];

export const CATEGORY_NAMES = {
  BUILDING: "Hochbau",
  UNDERGROUND: "Tiefbau",
  OTHER: "Sonstiges"
};

const CATEGORY_ICONS = {
  BUILDING: "house",
  UNDERGROUND: "excavator",
  OTHER: "other",
};

export const CATEGORIES = [
  {
    name: CATEGORY_NAMES.BUILDING,
    icon: CATEGORY_ICONS.BUILDING,
    filterName: CATEGORY_NAMES.BUILDING,
    filterCategory: FILTERNAME_CATEGORY_NAMES[0].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[0].name,
    img: hochbau,
  },
  {
    name: CATEGORY_NAMES.UNDERGROUND,
    icon: CATEGORY_ICONS.UNDERGROUND,
    filterName: CATEGORY_NAMES.UNDERGROUND,
    filterCategory: FILTERNAME_CATEGORY_NAMES[0].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[0].name,
    img: tiefbauarbeiten,
  },
  {
    name: CATEGORY_NAMES.OTHER,
    icon: CATEGORY_ICONS.OTHER,
    filterName: CATEGORY_NAMES.OTHER,
    filterCategory: FILTERNAME_CATEGORY_NAMES[0].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[0].name,
    img: sonstiges,
  },
];

export const MAENGEL_CATEGORIES = [
  {
    name: "Beschilderung, Verkehrszeichen",
    img: beschilderung,
    recipient: "road_sign"
  },
  {
    name: "Parkplätze/Parkhäuser",
    img: parkplaetze,
    recipient: "parking_spaces"
  },
  {
    name: "Straßen, Rad- und Gehwege",
    img: strassenschaden,
    recipient: "streets"
  },
  {
    name: "Gewässer, Durchlässe, Einläufe",
    img: gewaesser,
    recipient: "waters"
  },
  {
    name: "Bürger- und Vereinshäuser",
    img: buergerhaeuser,
    recipient: "community_centre"
  },
  {
    name: "Wilde Müllablagerungen",
    img: wildeMuellablagerungen,
    recipient: "wild_garbage_dumping"
  },
  {
    name: "Abfallbehälter/Glascontainer",
    img: muelleimervoll,
    recipient: "trash_cans"
  },
  {
    name: "Öffentliche WC-Anlagen",
    img: wcanlagen,
    recipient: "public_toilets"
  },
  {
    name: "Parkanlagen",
    img: vandalismus,
    recipient: "parks"
  },
  {
    name: "Spielplätze, Sportanlagen, Freizeitanlagen",
    img: spielplatz,
    recipient: "leisure_facilities"
  },
  {
    name: "Straßenbeleuchtung",
    img: null,
    recipient: "lamps"
  },
  {
    name: "Sonstiges",
    img: null,
    recipient: "other"
  },
];

export const TIME_FRAMES = [
  {
    name: "Geplant",
    color: colors.primary,
    icon: "time",
    filterName: "planned",
    filterCategory: FILTERNAME_CATEGORY_NAMES[1].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[1].name,
  },
  {
    name: "Aktiv",
    color: colors.rejected,
    icon: "time",
    filterName: "active",
    filterCategory: FILTERNAME_CATEGORY_NAMES[1].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[1].name,
  },
  {
    name: "Archiv",
    color: colors.green,
    icon: "time",
    filterName: "archived",
    filterCategory: FILTERNAME_CATEGORY_NAMES[1].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[1].name,
  },
];
