import { useState } from "react";

import { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Box from "@mui/material/Box";
import { Stack } from "@mui/material";

import { Map } from "../components/map";
import map from "../config/map";
import { useStateContext } from "../providers/state-provider";
import { MarkerPin } from "../elements/marker-pin";
import { SearchBar } from "../components/reporter/search-bar";
import { Route, Redirection } from "../components/route";
import { getGeoJSON } from "../utils/location-utils";
import { DeficiencyReporter } from "../components/deficiency-reporter";
import { useDeficiencyContext } from "../providers/deficiency-provider";

export function CreateDeficiencyPage() {
  const { stateContext } = useStateContext();
  const { deficiencyContext } = useDeficiencyContext();
  const { activeStep, positionOverlay, location } = deficiencyContext;
  const [center, setCenter] = useState(map.center);
  const [triggerCenterMap, setTriggerCenterMap] = useState(true);

  const [satellite, setSatellite] = useState(false);

  const handleMapChange = () => {
    setSatellite(!satellite);
  };

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
        <MarkerPin report={{ status: "new" }} />
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
        <Map satellite={satellite} setCenter={setCenter} triggerCenterMap={triggerCenterMap}>
          <Route key="create-new-route" id="create-new-route" geojson={getGeoJSON([])} />
          <Redirection key="create-new-redirection" id="create-new-redirection" geojson={getGeoJSON([])} />
          {location && location.lng && location.lat && activeStep !== 0 ? (
            <Marker longitude={location.lng} latitude={location.lat} anchor="bottom">
              <MarkerPin report={{ status: "new" }} />
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
            {/* <MapTerrainToggleButton sx={{ position: "absolute" }} onMapChange={handleMapChange} satellite={satellite} /> */}
            <SearchBar />
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
              cursor: "default",
              pointerEvents: "none",
              mb: 4,
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
