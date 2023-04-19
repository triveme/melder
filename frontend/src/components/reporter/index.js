import { useEffect, useState } from "react";
import { coordinatesInsidePolygon } from "../../utils/position-utils";

// import HCaptcha from "@hcaptcha/react-hcaptcha";

// import { Marker, useMapEvents } from "react-leaflet";
import { useHistory } from "react-router-dom";

import { BottomRow } from "../bottom-row";
import { useStateContext } from "../../providers/state-provider";
import { selectableArea } from "../../data/SelectableArea.js";
import { reporter } from "../../config/reporter";
import { CreateEditReportWrapper } from "./create-edit-report";

export function Reporter({ center }) {
  const { stateContext, setStateContext } = useStateContext();
  const { activeStep, hasRedirection, idIfEdit } = stateContext.reporter;
  const [validCoordinates, setValidCoordinates] = useState(true);
  const [postedID, setPostedID] = useState(-1);
  const history = useHistory();
  const [redirectionStep, setRedirectionStep] = useState(false);

  const checkIfCoordinatesAreValid = () => {
    setValidCoordinates(coordinatesInsidePolygon(center, selectableArea));
  };

  useEffect(() => {
    checkIfCoordinatesAreValid();
    // eslint-disable-next-line
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
          captchaSolved: false,
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
            captchaSolved: false,
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
          captchaSolved: false,
        },
      });
    }
  };

  const handleReset = () => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...reporter.default,
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

  const handlePostFinished = () => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...reporter.default,
      },
    });
    // open new Report after posting
    if (postedID !== -1) {
      history.push({
        pathname: "melder",
        search: `?report=${postedID}`,
      });
    }
    // reset postedID
    setPostedID(-1);
  };

  const handlePostReportSuccess = ({ data }) => {
    setStateContext({
      ...stateContext,
      queryTrigger: stateContext.queryTrigger + 1,
      // selectedReport: data?.id ? data.id : null,
      reporter: {
        ...stateContext.reporter,
        activeStep: activeStep + 1,
        captchaSolved: false,
        userMarkerPosition: [],
      },
    });
    if (data && data.id) {
      setPostedID(data.id);
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
          handlePostFinished={handlePostFinished}
          handlePostReportSuccess={handlePostReportSuccess}
          handlePositionReset={handlePositionReset}
          activeStep={activeStep}
          reporter={reporter}
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
