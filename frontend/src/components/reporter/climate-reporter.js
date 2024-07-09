import { useEffect, useState } from "react";
import { coordinatesInsidePolygon } from "../../utils/position-utils";

import { BottomRowClimate } from "../bottom-row-climate";
import { useStateContext } from "../../providers/state-provider";
import { selectableArea } from "../../data/SelectableArea.js";
import { CLIMATE_REPORTER } from "../../config/reporter";
import { CreateEditClimateReportWrapper } from "./create-edit-climate-report";
import { useQuery } from "../../providers/query-params-provider";

export function ClimateReporter({ center }) {
  const { stateContext, setStateContext } = useStateContext();
  const { activeStep, idIfEdit } = stateContext.climateReporter;
  const [validCoordinates, setValidCoordinates] = useState(true);
  const query = useQuery();

  const climateProjectView = query.get("ansicht") === "standortuebergreifend" ? 1 : 0;

  const checkIfCoordinatesAreValid = () => {
    setValidCoordinates(coordinatesInsidePolygon(center, selectableArea));
  };

  useEffect(() => {
    checkIfCoordinatesAreValid();
    // eslint-disable-next-line
  }, [center]);

  const handleNext = () => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        activeStep: activeStep + 1,
      },
    });
  };

  const handlePositionAccept = () => {
    if (activeStep === 1) {
      if (validCoordinates && climateProjectView === 0) {
        setStateContext({
          ...stateContext,
          climateReporter: {
            ...stateContext.climateReporter,
            activeStep: activeStep + 1,
            userMarkerPosition: [center],
          },
        });
      }
    } else {
      setStateContext({
        ...stateContext,
        climateReporter: {
          ...stateContext.climateReporter,
          activeStep: activeStep + 1,
        },
      });
    }
  };

  const handleReset = () => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...CLIMATE_REPORTER.default,
      },
    });
  };

  const handlePositionReset = () => {
    if (activeStep === 1) {
      handleReset();
    } else if (activeStep === 2) {
      if (!idIfEdit) {
        setStateContext({
          ...stateContext,
          climateReporter: {
            ...stateContext.climateReporter,
            newRedirection: [],
          },
        });
      }
    }
  };

  return (
    <>
      {activeStep < 0 ? (
        /* Standardansicht ---------------------------------------------------------------------------------------- */
        <BottomRowClimate handleNext={handleNext} />
      ) : (
        /** Meldung alegen ---------------------------------------------------------------------------------------- */
        <CreateEditClimateReportWrapper
          handleNext={handleNext}
          handlePositionReset={handlePositionReset}
          activeStep={activeStep}
          climateReporter={CLIMATE_REPORTER}
          validCoordinates={validCoordinates}
          handlePositionAccept={handlePositionAccept}
          handleReset={handleReset}
        />
      )}
    </>
  );
}
