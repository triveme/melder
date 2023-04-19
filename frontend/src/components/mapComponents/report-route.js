import { Fragment } from "react";
import { Redirection, Route } from "../route";
import { getGeoJSON } from "../../utils/location-utils";
import { Marker } from "react-map-gl";
import { MarkerPin } from "../../elements/marker-pin";
import { Box } from "@mui/system";
import redirectionSign from "../../assets/images/RedirectionSign.svg";

export function ReportRoute({ report, selectedReport, handleMarkerClick, redirection }) {
  let name = redirection ? "redirection" : "route";

  let lineLayer = redirection ? (
    <Redirection
      key={`redirection-no-${report.id}`}
      id={`redirection-${report.id}`}
      geojson={getGeoJSON(report.redirection)}
      report={report}
    />
  ) : (
    <Route
      key={`${name}-no-${report.id}`}
      id={`${name}-${report.id}`}
      geojson={getGeoJSON(report.location)}
      report={report}
    />
  );

  let marker = redirection ? (
    <Marker
      key={`redirection-marker-${report.id}`}
      longitude={report.redirection[Math.floor(report.redirection.length / 2)].lng}
      latitude={report.redirection[Math.floor(report.redirection.length / 2)].lat}
      anchor="center"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: 60,
          cursor: "pointer",
          position: "relative",
        }}
      >
        <img src={redirectionSign} alt="redirection-sign" />
      </Box>
    </Marker>
  ) : (
    <Marker
      key={`marker-${name}-${report.id}`}
      longitude={report.location[Math.floor(report.location.length / 2)].lng}
      latitude={report.location[Math.floor(report.location.length / 2)].lat}
      anchor="bottom"
    >
      <MarkerPin report={report} selectedReport={selectedReport} onClick={() => handleMarkerClick(report)} />
    </Marker>
  );

  return (
    <Fragment key={`${name}-group-no-${report.id}`}>
      {lineLayer}
      {marker}
    </Fragment>
  );
}
