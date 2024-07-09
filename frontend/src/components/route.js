import { Source, Layer } from "react-map-gl";
import colors from "../theme/colors";

export function Route({ geojson, id, element, category }) {
  if (!category) {
    throw new Error("Route: category prop is required");
  }

  let baseColor = colors.primary;

  if (element) {
    if (category === "construction") {
      baseColor =
        element.status === "hidden"
          ? colors.primaryDark
          : element.endDate && new Date(element.endDate) < new Date()
          ? colors.green
          : element.startDate && new Date(element.startDate) > new Date()
          ? colors.primary
          : colors.rejected;
    } else if (category === "climate") {
      baseColor =
        element.status === "hidden"
          ? colors.primaryDark
          : element.status === "finished"
          ? colors.green
          : element.status === "inProgress"
          ? colors.rejected
          : colors.primary;
    }
  }

  const routeLineStyle = {
    type: "line",
    paint: {
      "line-color": baseColor,
      "line-width": 4,
      "line-dasharray": [3, 2],
    },
    layout: {
      visibility: "visible",
      "line-cap": "round",
    },
  };

  return (
    <Source key={`route-${id}-source`} id={id} type="geojson" data={geojson}>
      <Layer key={`route-${id}-layer`} {...routeLineStyle} interactive />
    </Source>
  );
}

export function Redirection({ geojson, id }) {
  const baseColor = colors.redirection;

  const redirectionLineStyle = {
    type: "line",
    paint: {
      "line-color": baseColor,
      "line-width": 4,
    },
    layout: {
      visibility: "visible",
      "line-cap": "round",
    },
  };

  return (
    <Source key={`redirection-${id}-source`} id={id} type="geojson" data={geojson}>
      <Layer key={`redirection-${id}-layer`} {...redirectionLineStyle} interactive />
    </Source>
  );
}
