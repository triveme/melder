import { Stepper, Step, StepLabel, StepContent, Typography, Box, Button } from "@mui/material";
import { LoadingAndCancelButtons } from "../../elements/loading-button";
import { reporter } from "../../config/reporter";
import { deficiencyReporter } from "../../config/deficiency-reporter";
import { useDeficiencyContext } from "../../providers/deficiency-provider";

import { Step1 } from "./step-1";
import { Step2 } from "./step-2";
import { Step3 } from "./step-3";
import { createDeficiency } from "../../clients/deficiency-client";
import { MAENGEL_CATEGORIES } from "../../constants";

const matchCategoryWithRecipient = (cat) => {
  for (let i = 0; i < MAENGEL_CATEGORIES.length; i++) {
    if (MAENGEL_CATEGORIES[i].name === cat) {
      return MAENGEL_CATEGORIES[i].recipient;
    }    
  }
  return "other";
}

export function CreateEditDeficiencySteps({ handleNext, handleReset, handlePostReportSuccess }) {
  const { deficiencyContext, setDeficiencyContext } = useDeficiencyContext();
  const {
    activeStep,
    description,
    email,
    streetName,
    streetNumber,
    locationName,
    zipCode,
    category,
    location,
    images,
    phoneNumber,
  } = deficiencyContext;

  const handlePostReportClick = () => {
    // TODO: Send captcha to backend to verify requests
    const formData = new FormData();
    if (location && location.lng && location.lat) {
      formData.append("lng", location.lng);
      formData.append("lat", location.lat);
    } else {
      formData.append("city", locationName);
      formData.append("zip", zipCode);
      formData.append("street", streetName);
      formData.append("house_no", streetNumber);
    }
    formData.append("category", category);
    formData.append("recipient", matchCategoryWithRecipient(category));
    formData.append("description", description);
    formData.append("email", email);
    formData.append("phone_no", phoneNumber);
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append(`file`, image);
      });
    }

    return createDeficiency(formData);
  };

  const handleBack = () => {
    if (activeStep === 1 && location) {
      setDeficiencyContext({
        ...deficiencyContext,
        activeStep: deficiencyContext.activeStep - 1,
        positionOverlay: true,
      });
    } else {
      setDeficiencyContext({ ...deficiencyContext, activeStep: deficiencyContext.activeStep - 1 });
    }
  };

  return (
    <Stepper activeStep={activeStep} orientation="vertical" sx={{ width: "100%", paddingX: 1 }}>
      {deficiencyReporter.steps.map((step, index) => (
        <Step
          key={step.label}
          sx={{
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden",
            "& .MuiPaper-root": {
              borderRadius: 0,
              backgroundColor: "rgba(0, 0, 0, 0)",
            },
          }}
        >
          <StepLabel>
            <Typography fontSize={14}>
              <strong>{step.label}</strong>{" "}
            </Typography>{" "}
          </StepLabel>
          <StepContent>
            {index === 0 ? (
              <Step1 step={step} />
            ) : index === 1 ? (
              <Step2 step={step} />
            ) : index === 2 ? (
              <Step3 step={step} />
            ) : null}
            <Box sx={{ mb: 1.5 }}>
              {index === deficiencyReporter.steps.length - 1 ? (
                <LoadingAndCancelButtons
                  queryFun={handlePostReportClick}
                  cancelFun={handleBack}
                  queryCompleteFun={handlePostReportSuccess}
                  queryText={deficiencyReporter.send}
                  cancelText={deficiencyReporter.back}
                  style={{ mt: 1, mr: 1 }}
                />
              ) : (
                <>
                  <Button
                    variant="contained"
                    disabled={
                      (index === 0 && (!streetName || !streetNumber || !locationName || !zipCode)) ||
                      (index === 1 && (description === "" || category === ""))
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
      ))}
    </Stepper>
  );
}
