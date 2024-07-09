import { Stepper, Step, StepLabel, StepContent, Alert, Typography, Box, Button } from "@mui/material";

import { DataStep } from "./data-step";
import { LoadingAndCancelButtons } from "../../elements/loading-button";
import { CONSTRUCTION_REPORTER } from "../../config/reporter";
import { useStateContext } from "../../providers/state-provider";
import { createReport, updateReport } from "../../clients/report-client";
import { DualToggleButton } from "../../elements/dual-toggle-button";

import { useQuery } from "../../providers/query-params-provider";
import { useHistory } from "react-router-dom";
export function CreateEditReport({
  validCoordinates,
  handleNext,
  handleReset,
  removedImages,
  setRemovedImages,
  center,
}) {
  const history = useHistory();
  const query = useQuery();
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
    return createReport(stateContext.authToken, formData);
  };

  const handleUpdateReportClick = () => {
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

  const handlePostReportSuccess = ({ data }) => {
    // ensure report is shown by updating search params
    const searchParams = new URLSearchParams(query);
    searchParams.delete("report");
    searchParams.append("report", data.id);

    const categoryFilter = searchParams.getAll("kategorie");
    if (!categoryFilter.includes(data.category.toLowerCase())) {
      searchParams.append("kategorie", data.category.toLowerCase());
    }

    const statusFilter = searchParams.getAll("status");
    let statusOfNewReport = "geplant";
    const currentDate = new Date();
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (currentDate > endDate) {
      statusOfNewReport = "archiv";
    } else if (currentDate > startDate && currentDate < endDate) {
      statusOfNewReport = "aktiv";
    }
    if (!statusFilter.includes(statusOfNewReport)) {
      searchParams.append("status", statusOfNewReport);
    }

    history.push({
      pathname: "melder",
      search: searchParams.toString(),
    });

    setStateContext((prevState) => {
      return {
        ...prevState,
        queryTrigger: prevState.queryTrigger + 1,
        reporter: {
          ...CONSTRUCTION_REPORTER.default,
        },
      };
    });
  };

  const handleUpdateReportSuccess = ({ data }) => {
    // ensure report is shown by updating search params
    const searchParams = new URLSearchParams(query);
    searchParams.delete("report");
    searchParams.append("report", data.id);

    const statusFilter = searchParams.getAll("status");
    let statusOfNewReport = "geplant";
    const currentDate = new Date();
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (currentDate > endDate) {
      statusOfNewReport = "archiv";
    } else if (currentDate > startDate && currentDate < endDate) {
      statusOfNewReport = "aktiv";
    }
    if (!statusFilter.includes(statusOfNewReport)) {
      searchParams.append("status", statusOfNewReport);
    }

    history.push({
      pathname: "melder",
      search: searchParams.toString(),
    });

    setStateContext((prevState) => {
      return {
        ...prevState,
        queryTrigger: prevState.queryTrigger + 1,
        reporter: {
          ...CONSTRUCTION_REPORTER.default,
        },
      };
    });
  };

  const handleBack = () => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        activeStep: activeStep - 1,
      },
    });
  };

  return (
    <Stepper
      activeStep={stateContext.reporter.idIfEdit ? activeStep - 1 : activeStep}
      orientation="vertical"
      sx={{ width: "100%", paddingX: 1 }}
    >
      {CONSTRUCTION_REPORTER.steps.map((step, index) =>
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
                  <DualToggleButton options={CONSTRUCTION_REPORTER.steps[0].options} type="construction" />
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
                {index === CONSTRUCTION_REPORTER.steps.length - 1 ? (
                  !stateContext.reporter.idIfEdit ? (
                    <LoadingAndCancelButtons
                      queryFun={handlePostReportClick}
                      cancelFun={handleBack}
                      queryCompleteFun={handlePostReportSuccess}
                      queryText={CONSTRUCTION_REPORTER.send}
                      cancelText={CONSTRUCTION_REPORTER.back}
                      style={{ mt: 1, mr: 1 }}
                    />
                  ) : (
                    <LoadingAndCancelButtons
                      queryFun={handleUpdateReportClick}
                      cancelFun={handleBack}
                      queryCompleteFun={handleUpdateReportSuccess}
                      queryText={CONSTRUCTION_REPORTER.edit}
                      cancelText={CONSTRUCTION_REPORTER.back}
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
                      }
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      <Typography variant="button" component="div">
                        {CONSTRUCTION_REPORTER.continue}
                      </Typography>
                    </Button>
                    <Button onClick={index === 0 ? handleReset : handleBack} sx={{ mt: 1, mr: 1 }} color="secondary">
                      <Typography variant="button" component="div" color="secondary">
                        {index === 0 ? CONSTRUCTION_REPORTER.cancel : CONSTRUCTION_REPORTER.back}
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
