import { Stepper, Step, StepLabel, StepContent, Alert, Typography, TextField, Box, Button } from "@mui/material";
import { useQuery } from "../../providers/query-params-provider";

import { DataStepClimate } from "./data-step-climate";
import { LoadingAndCancelButtons } from "../../elements/loading-button";
import { CLIMATE_REPORTER } from "../../config/reporter";
import { getDisplayNameAndCategoryFromFilterName, getFilterNameFromDisplayValue } from "../../constants";
import { useStateContext } from "../../providers/state-provider";
import { createClimateProject, updateClimateProject } from "../../clients/climate-project-client";
import { useHistory } from "react-router-dom";

export function CreateEditReportClimate({
  validCoordinates,
  handleNext,
  handleReset,
  removedImages,
  setRemovedImages,
}) {
  const query = useQuery();
  const history = useHistory();
  const climateProjectView = query.get("ansicht") === "standortuebergreifend" ? 1 : 0;

  const { stateContext, setStateContext } = useStateContext();
  const {
    activeStep,
    category,
    categoryDisplayName,
    descriptionValue,
    timeHorizonValue,
    costsValue,
    images,
    userMarkerPosition,
    locationTextValue,
    titleValue,
    linkValue,
    responsibleValue,
    startDateValue,
    endDateValue,
  } = stateContext.climateReporter;

  const handlePostClimateProjectClick = () => {
    // TODO: Send captcha to backend to verify requests
    const formData = new FormData();
    formData.append(`location`, JSON.stringify(userMarkerPosition));
    formData.append("locationText", locationTextValue);
    formData.append("category", getFilterNameFromDisplayValue(category, categoryDisplayName));
    formData.append("description", descriptionValue);
    formData.append("timeHorizon", timeHorizonValue);
    formData.append("startDate", startDateValue);
    formData.append("endDate", endDateValue);
    formData.append("title", titleValue);
    formData.append("link", linkValue);
    formData.append("costs", costsValue);
    formData.append("responsible", responsibleValue);
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append(`file`, image);
      });
    }
    return createClimateProject(stateContext.authToken, formData);
  };

  const handleUpdateClimateProjectClick = () => {
    // TODO: Send captcha to backend to verify request
    const formData = new FormData();
    formData.append(`location`, JSON.stringify(userMarkerPosition));
    formData.append("locationText", locationTextValue);
    formData.append("category", getFilterNameFromDisplayValue(category, categoryDisplayName));
    formData.append("description", descriptionValue);
    formData.append("timeHorizon", timeHorizonValue);
    formData.append("startDate", startDateValue);
    formData.append("endDate", endDateValue);
    formData.append("title", titleValue);
    formData.append("link", linkValue);
    formData.append("costs", costsValue);
    formData.append("responsible", responsibleValue);
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append(`file`, image);
      });
    }
    if (removedImages && removedImages.length > 0) {
      formData.append("removedImage", JSON.stringify(removedImages));
    }
    return updateClimateProject(stateContext.authToken, stateContext.climateReporter.idIfEdit, formData);
  };

  const handlePostSuccess = ({ data }) => {
    // ensure project is shown by updating search params
    const searchParams = new URLSearchParams(query);
    searchParams.delete("klima-projekt");
    searchParams.set("klima-projekt", data.id);

    const timeHorizonFilter = searchParams.getAll("zeithorizont");
    if (!timeHorizonFilter.includes(data.timeHorizon.toLowerCase())) {
      searchParams.append("zeithorizont", data.timeHorizon.toLowerCase());
    }

    const { displayName, category } = getDisplayNameAndCategoryFromFilterName(data.category);
    if (category === "Klimaschutz") {
      const climateProtectionFilter = searchParams.getAll("schutz");
      if (!climateProtectionFilter.includes(data.category)) {
        searchParams.append("schutz", data.category);
      }
    } else if (category === "Klimaanpassung") {
      const climateAdjustmentFilter = searchParams.getAll("anpassung");
      if (!climateAdjustmentFilter.includes(data.category)) {
        searchParams.append("anpassung", data.category);
      }
    }

    history.push({
      pathname: "klima",
      search: searchParams.toString(),
    });

    setStateContext((prevState) => {
      return {
        ...prevState,
        queryTrigger: prevState.queryTrigger + 1,
        climateReporter: {
          ...CLIMATE_REPORTER.default,
        },
      };
    });
  };

  const handleUpdateSuccess = ({ data }) => {
    // ensure project is shown by updating search params
    const searchParams = new URLSearchParams(query);
    searchParams.delete("klima-projekt");
    searchParams.set("klima-projekt", data.id);

    const timeHorizonFilter = searchParams.getAll("zeithorizont");
    if (!timeHorizonFilter.includes(data.timeHorizon.toLowerCase())) {
      searchParams.append("zeithorizont", data.timeHorizon.toLowerCase());
    }

    const { displayName, category } = getDisplayNameAndCategoryFromFilterName(data.category);
    if (category === "Klimaschutz") {
      const climateProtectionFilter = searchParams.getAll("schutz");
      if (!climateProtectionFilter.includes(data.category.toLowerCase())) {
        searchParams.append("schutz", data.category.toLowerCase());
      }
    } else if (category === "Klimaanpassung") {
      const climateAdjustmentFilter = searchParams.getAll("anpassung");
      if (!climateAdjustmentFilter.includes(data.category.toLowerCase())) {
        searchParams.append("anpassung", data.category.toLowerCase());
      }
    }

    history.push({
      pathname: "klima",
      search: searchParams.toString(),
    });

    setStateContext((prevState) => {
      return {
        ...prevState,
        queryTrigger: prevState.queryTrigger + 1,
        climateReporter: {
          ...CLIMATE_REPORTER.default,
        },
      };
    });
  };

  const handleBack = () => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        activeStep: activeStep - 1,
      },
    });
  };

  const handlelocationTextChange = (event) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        locationTextValue: event.target.value,
      },
    });
  };

  return (
    <Stepper
      activeStep={stateContext.climateReporter.idIfEdit ? activeStep - 1 : activeStep}
      orientation="vertical"
      sx={{
        width: "100%",
        paddingX: 1,
        zIndex: 12,
      }}
    >
      {CLIMATE_REPORTER.steps.map((step, index) =>
        stateContext.climateReporter.idIfEdit && index === 0 ? null : (
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
                    {climateProjectView === 0 ? step.descriptionMarkerLocation : step.descriptionMarkerArea}
                  </Typography>
                </>
              ) : index === 1 ? (
                climateProjectView === 0 ? (
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
                ) : (
                  <>
                    <Typography component="div" variant="body2" sx={{ mb: 1 }}>
                      {step.areaInfoText}
                    </Typography>
                    <TextField
                      id="location-description-textfield"
                      label={step.area}
                      fullWidth
                      size="small"
                      placeholder={step.areaPlaceholder}
                      value={stateContext.climateReporter.locationTextValue}
                      onChange={handlelocationTextChange}
                      inputProps={{ maxLength: 100 }}
                      sx={{ mt: 1, mb: 1 }}
                    />
                  </>
                )
              ) : index === 2 ? (
                <DataStepClimate removedImages={removedImages} setRemovedImages={setRemovedImages} />
              ) : index === 3 ? (
                <>
                  <Typography component="div" variant="caption" sx={{ mb: 1 }}>
                    {stateContext.climateReporter.idIfEdit ? step.acceptEdit : step.accept}
                  </Typography>
                </>
              ) : null}
              <Box sx={{ mb: 1.5 }}>
                {index === CLIMATE_REPORTER.steps.length - 1 ? (
                  !stateContext.climateReporter.idIfEdit ? (
                    <LoadingAndCancelButtons
                      queryFun={handlePostClimateProjectClick}
                      cancelFun={handleBack}
                      queryCompleteFun={handlePostSuccess}
                      queryText={CLIMATE_REPORTER.send}
                      cancelText={CLIMATE_REPORTER.back}
                      style={{ mt: 1, mr: 1 }}
                    />
                  ) : (
                    <LoadingAndCancelButtons
                      queryFun={handleUpdateClimateProjectClick}
                      cancelFun={handleBack}
                      queryCompleteFun={handleUpdateSuccess}
                      queryText={CLIMATE_REPORTER.edit}
                      cancelText={CLIMATE_REPORTER.back}
                      style={{ mt: 1, mr: 1 }}
                    />
                  )
                ) : (
                  <>
                    <Button
                      variant="contained"
                      disabled={
                        (index === 0 && !validCoordinates) ||
                        (index === 1 && !locationTextValue) ||
                        (index === 2 &&
                          (descriptionValue === "" ||
                            !titleValue ||
                            !descriptionValue ||
                            !categoryDisplayName ||
                            !timeHorizonValue))
                      }
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      <Typography variant="button" component="div">
                        {CLIMATE_REPORTER.continue}
                      </Typography>
                    </Button>
                    <Button
                      onClick={
                        index === 0 || (climateProjectView === 1 && index < 2 && stateContext.climateReporter.idIfEdit)
                          ? handleReset
                          : handleBack
                      }
                      sx={{ mt: 1, mr: 1 }}
                      color="secondary"
                    >
                      <Typography variant="button" component="div" color="secondary">
                        {index === 0 || (climateProjectView === 1 && index < 2 && stateContext.climateReporter.idIfEdit)
                          ? CLIMATE_REPORTER.cancel
                          : CLIMATE_REPORTER.back}
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
