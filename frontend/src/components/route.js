import { Source, Layer } from "react-map-gl";
import colors from "../theme/colors";

export function Route({ geojson, id, report }) {
  const baseColor = report
    ? report.status === "hidden"
      ? colors.primaryDark
      : report.endDate && new Date(report.endDate) < new Date()
      ? colors.green
      : report.startDate && new Date(report.startDate) > new Date()
      ? colors.primary
      : colors.rejected
    : colors.primary;

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

export function Redirection({ geojson, id, report }) {
  // const baseColor = report && report.status === "hidden" ? colors.primaryDark : colors.redirection;
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
