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
    filterName: "kategorie",
  },
  {
    name: "Status",
    filterName: "status",
  },
  {
    name: "Zeithorizont",
    filterName: "zeithorizont",
  },
];

export const CATEGORY_NAMES = {
  BUILDING: "Hochbau",
  UNDERGROUND: "Tiefbau",
  OTHER: "Sonstiges",
};

const CATEGORY_ICONS = {
  BUILDING: "house",
  UNDERGROUND: "excavator",
  OTHER: "other",
};

export const CLIMATE_PROTECTION_CATEGORY_NAMES = {
  RENOVATION: "Bautechnik und energetische Sanierung",
  EFFICIENCY: "Energieeffizienz und Wärme-/Energiemanagement",
  RENEWABLE_ENERGY: "Erneuerbare Energien",
  CYCLE_FOOT_TRAFFIC: "Rad- und Fußverkehr",
  E_MOBILITY: "E-Mobilität u. alternative Antriebsformen",
  GENERAL: "Allgemeines",
};

export const CLIMATE_ADJUSTMENT_CATEGORY_NAMES = {
  PLANNING: "Stadt- und Raumplanung",
  INFRASTRUCTURE: "Verkehrsinfrastruktur",
  GREEN: "Stadtgrün",
  PROTECTION: "Naturschutz",
  FLOOD: "Hochwasserschutz",
  RAIN: "Starkregen u. Sturzfluten",
  GENERAL: "Allgemeines",
};

export const CONSTRUCTION_CATEGORIES = [
  {
    name: CATEGORY_NAMES.BUILDING,
    icon: CATEGORY_ICONS.BUILDING,
    filterName: CATEGORY_NAMES.BUILDING.toLowerCase(),
    filterCategory: "kategorie",
    filterCategoryName: "Kategorie",
    img: hochbau,
  },
  {
    name: CATEGORY_NAMES.UNDERGROUND,
    icon: CATEGORY_ICONS.UNDERGROUND,
    filterName: CATEGORY_NAMES.UNDERGROUND.toLowerCase(),
    filterCategory: "kategorie",
    filterCategoryName: "Kategorie",
    img: tiefbauarbeiten,
  },
  {
    name: CATEGORY_NAMES.OTHER,
    icon: CATEGORY_ICONS.OTHER,
    filterName: CATEGORY_NAMES.OTHER.toLowerCase(),
    filterCategory: "kategorie",
    filterCategoryName: "Kategorie",
    img: sonstiges,
  },
];

export const CLIMATE_PROTECTION_CATEGORIES = [
  {
    name: CLIMATE_PROTECTION_CATEGORY_NAMES.RENOVATION,
    icon: "renovation",
    filterName: "bautechnik",
    filterCategory: "schutz",
    filterCategoryName: "Schutz",
  },
  {
    name: CLIMATE_PROTECTION_CATEGORY_NAMES.EFFICIENCY,
    icon: "efficiency",
    filterName: "energieeffizienz",
    filterCategory: "schutz",
    filterCategoryName: "Schutz",
  },
  {
    name: CLIMATE_PROTECTION_CATEGORY_NAMES.RENEWABLE_ENERGY,
    icon: "wind",
    filterName: "erneuerbare_energien",
    filterCategory: "schutz",
    filterCategoryName: "Schutz",
  },
  {
    name: CLIMATE_PROTECTION_CATEGORY_NAMES.CYCLE_FOOT_TRAFFIC,
    icon: "bike",
    filterName: "rad_und_fussverkehr",
    filterCategory: "schutz",
    filterCategoryName: "Schutz",
  },
  {
    name: CLIMATE_PROTECTION_CATEGORY_NAMES.E_MOBILITY,
    icon: "e_car",
    filterName: "e_mobilitaet",
    filterCategory: "schutz",
    filterCategoryName: "Schutz",
  },
  {
    name: CLIMATE_PROTECTION_CATEGORY_NAMES.GENERAL,
    icon: "security",
    filterName: "allgemeiner_schutz",
    filterCategory: "schutz",
    filterCategoryName: "Schutz",
  },
];

export const CLIMATE_ADJUSTMENT_CATEGORIES = [
  {
    name: CLIMATE_ADJUSTMENT_CATEGORY_NAMES.PLANNING,
    icon: "city",
    filterName: "planung",
    filterCategory: "anpassung",
    filterCategoryName: "Anpassung",
  },
  {
    name: CLIMATE_ADJUSTMENT_CATEGORY_NAMES.INFRASTRUCTURE,
    icon: "traffic",
    filterName: "verkehrsinfrastruktur",
    filterCategory: "anpassung",
    filterCategoryName: "Anpassung",
  },
  {
    name: CLIMATE_ADJUSTMENT_CATEGORY_NAMES.GREEN,
    icon: "nature",
    filterName: "stadtgruen",
    filterCategory: "anpassung",
    filterCategoryName: "Anpassung",
  },
  {
    name: CLIMATE_ADJUSTMENT_CATEGORY_NAMES.PROTECTION,
    icon: "climate",
    filterName: "naturschutz",
    filterCategory: "anpassung",
    filterCategoryName: "Anpassung",
  },
  {
    name: CLIMATE_ADJUSTMENT_CATEGORY_NAMES.FLOOD,
    icon: "waves",
    filterName: "hochwasserschutz",
    filterCategory: "anpassung",
    filterCategoryName: "Anpassung",
  },
  {
    name: CLIMATE_ADJUSTMENT_CATEGORY_NAMES.RAIN,
    icon: "storm",
    filterName: "starkregen",
    filterCategory: "anpassung",
    filterCategoryName: "Anpassung",
  },
  {
    name: CLIMATE_ADJUSTMENT_CATEGORY_NAMES.GENERAL,
    icon: "compare",
    filterName: "allgemeine_anpassung",
    filterCategory: "anpassung",
    filterCategoryName: "Anpassung",
  },
];

export function getFilterNameFromDisplayValue(category, displayValue) {
  if (category === "Klimaschutz") {
    return CLIMATE_PROTECTION_CATEGORIES.find((c) => c.name === displayValue).filterName;
  } else if (category === "Klimaanpassung") {
    return CLIMATE_ADJUSTMENT_CATEGORIES.find((c) => c.name === displayValue).filterName;
  }
  throw new Error("Unknown category");
}

export function getDisplayNameAndCategoryFromFilterName(filterName) {
  const climateProtectionCategory = CLIMATE_PROTECTION_CATEGORIES.find((c) => c.filterName === filterName);
  if (climateProtectionCategory) {
    return {
      displayName: climateProtectionCategory.name,
      category: "Klimaschutz",
    };
  }
  const climateAdjustmentCategory = CLIMATE_ADJUSTMENT_CATEGORIES.find((c) => c.filterName === filterName);
  if (climateAdjustmentCategory) {
    return {
      displayName: climateAdjustmentCategory.name,
      category: "Klimaanpassung",
    };
  }
  throw new Error("Unknown filterName");
}

export const MAENGEL_CATEGORIES = [
  {
    name: "Beschilderung, Verkehrszeichen",
    img: beschilderung,
    recipient: "road_sign",
  },
  {
    name: "Parkplätze/Parkhäuser",
    img: parkplaetze,
    recipient: "parking_spaces",
  },
  {
    name: "Straßen, Rad- und Gehwege",
    img: strassenschaden,
    recipient: "streets",
  },
  {
    name: "Gewässer, Durchlässe, Einläufe",
    img: gewaesser,
    recipient: "waters",
  },
  {
    name: "Bürger- und Vereinshäuser",
    img: buergerhaeuser,
    recipient: "community_centre",
  },
  {
    name: "Wilde Müllablagerungen",
    img: wildeMuellablagerungen,
    recipient: "wild_garbage_dumping",
  },
  {
    name: "Abfallbehälter/Glascontainer",
    img: muelleimervoll,
    recipient: "trash_cans",
  },
  {
    name: "Öffentliche WC-Anlagen",
    img: wcanlagen,
    recipient: "public_toilets",
  },
  {
    name: "Parkanlagen",
    img: vandalismus,
    recipient: "parks",
  },
  {
    name: "Spielplätze, Sportanlagen, Freizeitanlagen",
    img: spielplatz,
    recipient: "leisure_facilities",
  },
  {
    name: "Straßenbeleuchtung",
    img: null,
    recipient: "lamps",
  },
  {
    name: "Sonstiges",
    img: null,
    recipient: "other",
  },
];

export const TIME_FRAMES = [
  {
    name: "Geplant",
    color: colors.primary,
    icon: "time",
    filterName: "geplant",
    filterCategory: FILTERNAME_CATEGORY_NAMES[1].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[1].name,
  },
  {
    name: "Aktiv",
    color: colors.rejected,
    icon: "time",
    filterName: "aktiv",
    filterCategory: FILTERNAME_CATEGORY_NAMES[1].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[1].name,
  },
  {
    name: "Archiv",
    color: colors.green,
    icon: "time",
    filterName: "archiv",
    filterCategory: FILTERNAME_CATEGORY_NAMES[1].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[1].name,
  },
];

export const TIME_FRAMES_CLIMATE = [
  {
    name: "Kurzfristig",
    color: colors.lightBlue,
    icon: "time",
    filterName: "kurzfristig",
    filterCategory: FILTERNAME_CATEGORY_NAMES[2].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[2].name,
  },
  {
    name: "Mittelfristig",
    color: colors.lightBlueDark,
    icon: "time",
    filterName: "mittelfristig",
    filterCategory: FILTERNAME_CATEGORY_NAMES[2].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[2].name,
  },
  {
    name: "Langfristig",
    color: colors.primary,
    icon: "time",
    filterName: "langfristig",
    filterCategory: FILTERNAME_CATEGORY_NAMES[2].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[2].name,
  },
  {
    name: "Archiv",
    color: colors.green,
    icon: "time",
    filterName: "archiv",
    filterCategory: FILTERNAME_CATEGORY_NAMES[2].filterName,
    filterCategoryName: FILTERNAME_CATEGORY_NAMES[2].name,
  },
];
