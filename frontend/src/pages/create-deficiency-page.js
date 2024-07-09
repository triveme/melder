import { useState } from "react";

import { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Box from "@mui/material/Box";
import { Stack } from "@mui/material";

import { Map } from "../components/map";
import map from "../config/map";
import { useStateContext } from "../providers/state-provider";
import { MarkerPin } from "../elements/marker-pin";
import SearchBar from "../components/reporter/search-bar";
import { Route, Redirection } from "../components/route";
import { getGeoJSON } from "../utils/location-utils";
import { DeficiencyReporter } from "../components/deficiency-reporter";
import { useDeficiencyContext } from "../providers/deficiency-provider";

export function CreateDeficiencyPage() {
  const { stateContext } = useStateContext();
  const { deficiencyContext } = useDeficiencyContext();
  const { activeStep, positionOverlay, location } = deficiencyContext;
  const [center, setCenter] = useState(map.center);

  let userPositionMarkerPin = null;

  if (activeStep === 0 && positionOverlay) {
    userPositionMarkerPin = (
      <Box
        sx={{
          position: "absolute",
          zIndex: 1000,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -100%)",
        }}
      >
        <MarkerPin element={{ status: "new" }} category="construction" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      >
        {stateContext.reporter.locationOption === "Standort" ? userPositionMarkerPin : null}
        <Map satellite={false} setCenter={setCenter} triggerCenterMap={true}>
          <Route key="create-new-route" id="create-new-route" geojson={getGeoJSON([])} category="construction" />
          <Redirection key="create-new-redirection" id="create-new-redirection" geojson={getGeoJSON([])} />
          {location && location.lng && location.lat && activeStep !== 0 ? (
            <Marker longitude={location.lng} latitude={location.lat} anchor="bottom">
              <MarkerPin element={{ status: "new" }} category="construction" />
            </Marker>
          ) : null}
          <Stack
            sx={{ mt: 2, ml: 2 }}
            position="absolute"
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            <SearchBar mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN} position="top-left" />
          </Stack>
        </Map>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          pointerEvents: "none",
          zIndex: 12,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              maxWidth: activeStep === 1 ? "100%" : "95vw",
              maxHeight: "calc(100% - 32px)",
              display: "block",
              cursor: "default",
              pointerEvents: "none",
              mb: "32px",
            }}
          >
            <DeficiencyReporter
              sx={{
                justifyContent: "end",
              }}
              center={center}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
