import * as React from "react";
import { useState } from "react";

import { Grow } from "@mui/material";
import { Fab } from "@mui/material";
import { Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

import { Icon } from "../icon";
import { reporter } from "../../config/reporter";
import useWindowDimensions from "../../providers/window-dimensions-provider";
import { useStateContext } from "../../providers/state-provider";

export function PositionOverlay({ validCoordinates, handleAccept, handlePositionReset }) {
  const [open, setOpen] = useState(true);
  const { width } = useWindowDimensions();
  const { stateContext } = useStateContext();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", height: "100%" }}>
      <Snackbar
        open={open}
        onClose={handleClose}
        message={
          stateContext.reporter.locationOption === "Standort"
            ? reporter.steps[1].descriptionMarker
            : reporter.steps[1].descriptionMarkers
        }
        autoHideDuration={4000}
        key={"Snackbar-key"}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 10, position: "absolute" }}
      />
      <Snackbar
        open={!validCoordinates && stateContext.reporter.locationOption === "Standort"}
        key={"warning"}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 10, position: "absolute" }}
      >
        <Alert variant="filled" severity="warning">
          {reporter.steps[1].alertText}
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
          disabled={
            (stateContext.reporter.activeStep === 2 &&
              stateContext.reporter.newRedirection &&
              stateContext.reporter.newRedirection.length < 2) ||
            (stateContext.reporter.locationOption === "Strecke" &&
              stateContext.reporter.lineCoordinates &&
              stateContext.reporter.lineCoordinates.length < 2) ||
            (stateContext.reporter.locationOption === "Standort" && !validCoordinates)
          }
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
