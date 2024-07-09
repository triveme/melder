import * as React from "react";
import { useState } from "react";

import { Grow } from "@mui/material";
import { Fab } from "@mui/material";
import { Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

import { Icon } from "../icon";
import { CLIMATE_REPORTER } from "../../config/reporter";
import useWindowDimensions from "../../providers/window-dimensions-provider";
import { useQuery } from "../../providers/query-params-provider";

export function PositionOverlayClimate({ validCoordinates, handleAccept, handlePositionReset }) {
  const [open, setOpen] = useState(true);
  const { width } = useWindowDimensions();
  const query = useQuery();
  const climateProjectView = query.get("ansicht") === "standortuebergreifend" ? 1 : 0;

  const handleClose = () => {
    setOpen(false);
  };

  if (climateProjectView === 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", height: "100%" }}>
      <Snackbar
        open={open}
        onClose={handleClose}
        message={CLIMATE_REPORTER.steps[1].descriptionMarker}
        autoHideDuration={4000}
        key={"Snackbar-key"}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 10, position: "absolute" }}
      />
      <Snackbar
        open={!validCoordinates}
        key={"warning"}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 10, position: "absolute" }}
      >
        <Alert variant="filled" severity="warning">
          {CLIMATE_REPORTER.steps[1].alertText}
        </Alert>
      </Snackbar>
      <Grow in={true}>
        <Fab
          color="error"
          aria-label="Abbrechen"
          sx={{
            pointerEvents: "all",
            ml: "12px !important",
            position: "relative",
            right: `${width * 0.05}px`,
          }}
          onClick={handlePositionReset}
        >
          <Icon icon="cancel" props={{ fontSize: "medium" }} />
        </Fab>
      </Grow>
      <Grow in={true}>
        <Fab
          disabled={!validCoordinates}
          color="primary"
          aria-label="Position bestätigen"
          sx={{
            pointerEvents: "all",
            ml: "12px !important",
            position: "relative",
            left: `${width * 0.05}px`,
          }}
          onClick={handleAccept}
        >
          <Icon icon="accept" props={{ fontSize: "medium" }} />
        </Fab>
      </Grow>
    </Box>
  );
}
