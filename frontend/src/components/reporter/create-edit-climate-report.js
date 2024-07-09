import { useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";

import { ThankYouStep } from "./thank-you-step";
import { CreateEditReportClimate } from "./create-edit-steps-climate";
import { PositionOverlayClimate } from "./position-overlay-climate";

import { useQuery } from "../../providers/query-params-provider";

export function CreateEditClimateReportWrapper({
  validCoordinates,
  handleNext,
  handlePositionReset,
  activeStep,
  climateReporter,
  handlePositionAccept,
  handleReset,
}) {
  const [removedImages, setRemovedImages] = useState([]);
  const query = useQuery();
  const climateProjectView = query.get("ansicht") === "standortuebergreifend" ? 1 : 0;

  return (
    <>
      {activeStep === 1 && climateProjectView !== 1 ? (
        <PositionOverlayClimate
          validCoordinates={validCoordinates}
          handleAccept={handlePositionAccept}
          handlePositionReset={handlePositionReset}
        />
      ) : (
        <Grow in={activeStep > -1}>
          <Card elevation={5} sx={{ pointerEvents: "all" }}>
            <Box component="form" sx={{ p: 1, maxWidth: 400, width: "95vw" }}>
              <Stack direction="row" spacing={1.5}>
                {activeStep !== climateReporter.steps.length ? (
                  <CreateEditReportClimate
                    validCoordinates={validCoordinates}
                    handleNext={handleNext}
                    handleReset={handleReset}
                    removedImages={removedImages}
                    setRemovedImages={setRemovedImages}
                  />
                ) : (
                  <ThankYouStep category="climate" />
                )}
              </Stack>
            </Box>
          </Card>
        </Grow>
      )}
    </>
  );
}
