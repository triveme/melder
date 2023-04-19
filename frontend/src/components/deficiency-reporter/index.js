import { useEffect, useState } from "react";

import { deficiencyReporter } from "../../config/deficiency-reporter";
import { selectableArea } from "../../data/SelectableArea";
import { useDeficiencyContext } from "../../providers/deficiency-provider";
import { coordinatesInsidePolygon } from "../../utils/position-utils";
import { CreateEditDeficiencyWrapper } from "./create-edit-deficiency";

export function DeficiencyReporter({ center }) {
  const { deficiencyContext, setDeficiencyContext } = useDeficiencyContext();
  const { activeStep } = deficiencyContext;
  const [validCoordinates, setValidCoordinates] = useState(true);

  const checkIfCoordinatesAreValid = () => {
    setValidCoordinates(coordinatesInsidePolygon(center, selectableArea));
  };

  useEffect(() => {
    checkIfCoordinatesAreValid();
    // eslint-disable-next-line
  }, [center]);

  const handleNext = () => {
    setDeficiencyContext({ ...deficiencyContext, activeStep: deficiencyContext.activeStep + 1 });
  };

  const handlePostFinished = () => {
    handleReset();
  };

  const handlePostReportSuccess = () => {
    setDeficiencyContext({
      ...deficiencyContext,
      activeStep: deficiencyContext.activeStep + 1,
    });
  };

  const handlePositionReset = () => {
    setDeficiencyContext({
      ...deficiencyContext,
      positionOverlay: false,
      location: {},
    });
  };

  const handlePositionAccept = () => {
    setDeficiencyContext({
      ...deficiencyContext,
      positionOverlay: false,
      location: center,
      activeStep: deficiencyContext.activeStep + 1,
      streetName: "",
      streetNumber: "",
      zipCode: "",
      locationName: "",
    });
  };

  const handleReset = () => {
    setDeficiencyContext({ ...deficiencyReporter.default });
  };

  return (
    <CreateEditDeficiencyWrapper
      handleNext={handleNext}
      handlePostFinished={handlePostFinished}
      handlePostReportSuccess={handlePostReportSuccess}
      handlePositionReset={handlePositionReset}
      activeStep={activeStep}
      reporter={deficiencyReporter}
      validCoordinates={validCoordinates}
      handlePositionAccept={handlePositionAccept}
      handleReset={handleReset}
    />
  );
}
