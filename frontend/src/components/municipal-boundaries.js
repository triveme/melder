import { useTheme } from "@emotion/react";
import { Source, Layer } from "react-map-gl";

import municipalBoundariesGeoJson from "../data/Gemarkungen_Huenfeld.geojson";
import boundariesHuenfeld from "../data/Grenze_Stadtgebiet_Huenfeld.geojson";
import areaAroundHuenfeld from "../data/Grenze_Stadtgebiet_Huenfeld_OuterArea.geojson";
import colors from "../theme/colors";

const layerStyle = {
  id: "municipal-boundaries-lines",
  type: "line",
  paint: {
    "line-color": "#cccccc",
    "line-width": 1,
    "line-opacity": 1,
  },
};

const layerStyleHuenfeld = {
  id: "boundaries-huenfeld-lines",
  type: "line",
  paint: {
    "line-color": "#cccccc",
    "line-width": 2,
    "line-opacity": 1,
  },
};

const areaStyleLight = {
  id: "water-123",
  type: "fill",
  paint: {
    "fill-color": "#e1ebfc",
    "fill-opacity": 0.6,
  },
};

const areaStyleDark = {
  id: "water-123",
  type: "fill",
  paint: {
    "fill-color": colors.backgroundDark,
    "fill-opacity": 0.6,
  },
};

const areaStyleSatellite = {
  id: "water-123",
  type: "fill",
  paint: {
    "fill-color": colors.darkGreen,
    "fill-opacity": 0.6,
  },
};

const layerStyleHuenfeldSatellite = {
  id: "boundaries-huenfeld-lines",
  type: "line",
  paint: {
    "line-color": colors.lightGrey,
    "line-width": 3,
  },
};

const layerStyleSatellite = {
  id: "municipal-boundaries-lines",
  type: "line",
  paint: {
    "line-color": colors.lightGrey,
    "line-width": 1.5,
  },
};

export function MunicipalBoundaries({ satellite }) {
  return (
    <Source key="municipal-boundaries" id="municipal-boundaries" type="geojson" data={municipalBoundariesGeoJson}>
      <Layer {...(satellite ? layerStyleSatellite : layerStyle)} />
    </Source>
  );
}

export function BoundariesHuenfeld({ satellite }) {
  return (
    <Source key="boundaries-huenfeld" id="boundaries-huenfeld" type="geojson" data={boundariesHuenfeld}>
      <Layer {...(satellite ? layerStyleHuenfeldSatellite : layerStyleHuenfeld)} />
    </Source>
  );
}

export function Area({ satellite }) {
  const theme = useTheme();

  return (
    <Source key="area" id="area" type="geojson" data={areaAroundHuenfeld}>
      <Layer {...(satellite ? areaStyleSatellite : theme.palette.mode === "light" ? areaStyleLight : areaStyleDark)} />
    </Source>
  );
}
