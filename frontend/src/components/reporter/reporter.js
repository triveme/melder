import { useEffect, useState } from "react";
import { coordinatesInsidePolygon } from "../../utils/position-utils";

import { BottomRow } from "../bottom-row";
import { useStateContext } from "../../providers/state-provider";
import { selectableArea } from "../../data/SelectableArea.js";
import { CONSTRUCTION_REPORTER } from "../../config/reporter";
import { CreateEditReportWrapper } from "./create-edit-report";

export function Reporter({ center }) {
  const { stateContext, setStateContext } = useStateContext();
  const { activeStep, hasRedirection, idIfEdit } = stateContext.reporter;
  const [validCoordinates, setValidCoordinates] = useState(true);
  const [redirectionStep, setRedirectionStep] = useState(false);

  const checkIfCoordinatesAreValid = () => {
    setValidCoordinates(coordinatesInsidePolygon(center, selectableArea));
  };

  useEffect(() => {
    checkIfCoordinatesAreValid();
  }, [center]);

  const handleNext = () => {
    if (activeStep === 2 && hasRedirection) {
      setRedirectionStep(true);
    } else {
      setStateContext({
        ...stateContext,
        reporter: {
          ...stateContext.reporter,
          activeStep: activeStep + 1,
        },
      });
    }
  };

  const handlePositionAccept = () => {
    if (activeStep === 1) {
      if (
        (validCoordinates && stateContext.reporter.locationOption === "Standort") ||
        (stateContext.reporter.lineCoordinates.length > 1 && stateContext.reporter.locationOption === "Strecke")
      ) {
        setStateContext({
          ...stateContext,
          reporter: {
            ...stateContext.reporter,
            activeStep: activeStep + 1,
            userMarkerPosition:
              stateContext.reporter.locationOption === "Standort" ? [center] : stateContext.reporter.lineCoordinates,
          },
        });
      }
      setRedirectionStep(false);
    } else {
      setStateContext({
        ...stateContext,
        reporter: {
          ...stateContext.reporter,
          activeStep: activeStep + 1,
        },
      });
    }
  };

  const handleReset = () => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...CONSTRUCTION_REPORTER.default,
      },
    });
    setRedirectionStep(false);
  };

  const handlePositionReset = () => {
    if (activeStep === 1) {
      handleReset();
    } else if (activeStep === 2) {
      if (!idIfEdit) {
        setStateContext({
          ...stateContext,
          reporter: {
            ...stateContext.reporter,
            newRedirection: [],
          },
        });
      }

      setRedirectionStep(false);
    }
  };

  return (
    <>
      {activeStep < 0 ? (
        /* Standardansicht ---------------------------------------------------------------------------------------- */
        <BottomRow handleNext={handleNext} />
      ) : (
        /** Meldung alegen ---------------------------------------------------------------------------------------- */
        <CreateEditReportWrapper
          handleNext={handleNext}
          handlePositionReset={handlePositionReset}
          activeStep={activeStep}
          reporter={CONSTRUCTION_REPORTER}
          validCoordinates={validCoordinates}
          center={center}
          redirectionStep={redirectionStep}
          handlePositionAccept={handlePositionAccept}
          handleReset={handleReset}
        />
      )}
    </>
  );
}
