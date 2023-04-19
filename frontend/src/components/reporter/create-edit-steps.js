import { Stepper, Step, StepLabel, StepContent, Alert, Typography, Box, Button } from "@mui/material";

import { DataStep } from "./data-step";
import { LoadingAndCancelButtons } from "../../elements/loading-button";
import { reporter } from "../../config/reporter";
import { useStateContext } from "../../providers/state-provider";
import { createReport, updateReport } from "../../clients/report-client";
import { DualToggleButton } from "../../elements/dual-toggle-button";

export function CreateEditReport({
  validCoordinates,
  handleNext,
  handleReset,
  handlePostReportSuccess,
  removedImages,
  setRemovedImages,
  center,
}) {
  const { stateContext, setStateContext } = useStateContext();
  const {
    activeStep,
    categoryValue,
    startDateValue,
    endDateValue,
    descriptionValue,
    images,
    userMarkerPosition,
    countyValue,
    newRedirection,
    title,
    link,
    contactPerson,
    constructionCosts,
  } = stateContext.reporter;

  const handlePostReportClick = () => {
    // TODO: Send captcha to backend to verify requests
    const formData = new FormData();
    formData.append(`location`, JSON.stringify(userMarkerPosition));
    formData.append("category", categoryValue);
    formData.append("county", countyValue);
    formData.append("description", descriptionValue);
    formData.append("startDate", startDateValue);
    formData.append("endDate", endDateValue);
    formData.append("title", title);
    formData.append("link", link);
    formData.append("contactPerson", contactPerson);
    formData.append("constructionCosts", constructionCosts);
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append(`file`, image);
      });
    }
    formData.append("redirection", JSON.stringify(newRedirection));
    // console.log(formData);
    return createReport(stateContext.authToken, formData);
  };

  const handleUpdateReportClick = () => {
    // TODO: Send captcha to backend to verify request
    const formData = new FormData();
    formData.append(`location`, JSON.stringify(userMarkerPosition));
    formData.append("category", categoryValue);
    formData.append("county", countyValue);
    formData.append("description", descriptionValue);
    formData.append("startDate", startDateValue);
    formData.append("endDate", endDateValue);
    formData.append("title", title);
    formData.append("link", link);
    formData.append("contactPerson", contactPerson);
    formData.append("constructionCosts", constructionCosts);
    formData.append("lastModifiedBy", stateContext.adminId);
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append(`file`, image);
      });
    }
    if (removedImages && removedImages.length > 0) {
      formData.append("removedImage", JSON.stringify(removedImages));
    }
    formData.append("redirection", JSON.stringify(newRedirection));
    return updateReport(stateContext.authToken, stateContext.reporter.idIfEdit, formData);
  };

  const handleUpdateReportSuccess = ({ data }) => {
    setStateContext({
      ...stateContext,
      queryTrigger: stateContext.queryTrigger + 1,
      selectedReport: data?.id ? data.id : null,
      reporter: {
        ...reporter.default,
      },
    });
  };

  const handleBack = () => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        activeStep: activeStep - 1,
        captchaSolved: false,
      },
    });
  };

  // const handleCaptchaSolve = (token, ekey) => {
  //   setStateContext({
  //     ...stateContext,
  //     reporter: {
  //       ...stateContext.reporter,
  //       captchaSolved: token,
  //     },
  //   });
  // };

  return (
    <Stepper
      activeStep={stateContext.reporter.idIfEdit ? activeStep - 1 : activeStep}
      orientation="vertical"
      sx={{ width: "100%", paddingX: 1 }}
    >
      {reporter.steps.map((step, index) =>
        stateContext.reporter.idIfEdit && index === 0 ? null : (
          <Step
            key={step.label}
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              {index === 0 ? (
                <>
                  <Typography component="div" variant="body2" sx={{ mb: 1 }}>
                    {step.descriptionMarker}
                  </Typography>
                  <DualToggleButton options={reporter.steps[0].options} />
                </>
              ) : index === 1 ? (
                <>
                  {!validCoordinates ? (
                    <Alert sx={{ pb: 0, pt: 0, mb: 1 }} severity="warning" variant="outlined">
                      {step.alertText}
                    </Alert>
                  ) : null}
                  <Typography component="div" variant="body2" sx={{ mb: 1 }}>
                    {step.descriptionMarker}
                  </Typography>
                </>
              ) : index === 2 ? (
                <DataStep removedImages={removedImages} setRemovedImages={setRemovedImages} center={center} />
              ) : index === 3 ? (
                <>
                  <Typography component="div" variant="caption" sx={{ mb: 1 }}>
                    {stateContext.reporter.idIfEdit ? step.acceptEdit : step.accept}
                  </Typography>
                </>
              ) : null}
              <Box sx={{ mb: 1.5 }}>
                {index === reporter.steps.length - 1 ? (
                  !stateContext.reporter.idIfEdit ? (
                    <LoadingAndCancelButtons
                      queryFun={handlePostReportClick}
                      cancelFun={handleBack}
                      queryCompleteFun={handlePostReportSuccess}
                      queryText={reporter.send}
                      cancelText={reporter.back}
                      style={{ mt: 1, mr: 1 }}
                    />
                  ) : (
                    <LoadingAndCancelButtons
                      queryFun={handleUpdateReportClick}
                      cancelFun={handleBack}
                      queryCompleteFun={handleUpdateReportSuccess}
                      queryText={reporter.edit}
                      cancelText={reporter.back}
                      style={{ mt: 1, mr: 1 }}
                    />
                  )
                ) : (
                  <>
                    <Button
                      variant="contained"
                      disabled={
                        (index === 0 && !validCoordinates) ||
                        (index === 2 && (descriptionValue === "" || !startDateValue || !endDateValue || !title))
                        // TODO: Reenable
                        // || (index === 2 && !captchaSolved)
                      }
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      <Typography variant="button" component="div">
                        {reporter.continue}
                      </Typography>
                    </Button>
                    <Button onClick={index === 0 ? handleReset : handleBack} sx={{ mt: 1, mr: 1 }} color="secondary">
                      <Typography variant="button" component="div" color="secondary">
                        {index === 0 ? reporter.cancel : reporter.back}
                      </Typography>
                    </Button>
                  </>
                )}
              </Box>
            </StepContent>
          </Step>
        ),
      )}
    </Stepper>
  );
}
