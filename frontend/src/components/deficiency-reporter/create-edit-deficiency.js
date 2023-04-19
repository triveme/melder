import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";

import { CreateEditDeficiencySteps } from "./create-edit-deficiency-steps";

import { PositionOverlay } from "../reporter/position-overlay";
import { DeficiencyThankYouStep } from "./thank-you-step";
import { useDeficiencyContext } from "../../providers/deficiency-provider";

export function CreateEditDeficiencyWrapper({
  validCoordinates,
  handleNext,
  handlePositionReset,
  handlePostReportSuccess,
  activeStep,
  reporter,
  handlePostFinished,
  handlePositionAccept,
  handleReset,
}) {
  const { deficiencyContext } = useDeficiencyContext();

  return (
    <>
      {activeStep === 0 && deficiencyContext.positionOverlay ? (
        <PositionOverlay
          validCoordinates={validCoordinates}
          handleAccept={handlePositionAccept}
          handlePositionReset={handlePositionReset}
        />
      ) : (
        <Grow in={activeStep > -1}>
          <Card elevation={5} sx={{ pointerEvents: "all" }}>
            <Box component="form" sx={{ p: 1, maxWidth: 400, width: "95vw" }}>
              <Stack direction="row" spacing={1.5}>
                {activeStep !== reporter.steps.length ? (
                  <CreateEditDeficiencySteps
                    handleNext={handleNext}
                    handleReset={handleReset}
                    handlePostReportSuccess={handlePostReportSuccess}
                  />
                ) : (
                  <DeficiencyThankYouStep onPostFinished={handlePostFinished} />
                )}
              </Stack>
            </Box>
          </Card>
        </Grow>
      )}
    </>
  );
}
