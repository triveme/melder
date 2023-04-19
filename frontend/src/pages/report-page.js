import { Fragment, useEffect, useState } from "react";

import { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useHistory, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Stack } from "@mui/material";

import { Map } from "../components/map";
import { Reporter } from "../components/reporter";
import map from "../config/map";
import { useAdmins } from "../clients/admin-client";
import { useReports } from "../clients/report-client";
import { useStateContext } from "../providers/state-provider";
import { ReportCard } from "../components/report-card";
import { MarkerPin } from "../elements/marker-pin";
import useDesktop from "../providers/use-desktop";
import { useQuery } from "../providers/query-params-provider";
import { FILTERNAME_CATEGORY_NAMES } from "../constants";
import { SearchBar } from "../components/reporter/search-bar";
import { Route, Redirection } from "../components/route";
import { getGeoJSON } from "../utils/location-utils";
import { ReportPOI } from "../components/mapComponents/report-poi";
import { ReportRoute } from "../components/mapComponents/report-route";
import { CreateEditRouteMarker } from "../components/mapComponents/create-edit-route";

const cardStylingDesktop = {
  width: 250,
  height: "100%",
  minWidth: 408,
  borderRadius: 0,
  right: 0,
  alignSelf: "flex-end",
  zIndex: 1100,
  pointerEvents: "auto",
};

const cardStylingMobile = {
  minWidth: "100%",
  height: "100%",
  borderRadius: 0,
  position: "absolute",
  zIndex: 1100,
  pointerEvents: "auto",
};

export function ReportPage() {
  const { stateContext, setStateContext } = useStateContext();
  const { activeStep, userMarkerPosition } = stateContext.reporter;
  const [editLocation, setEditLocation] = useState({ lat: "", lng: "" });
  const [center, setCenter] = useState(map.center);
  const [triggerCenterMap, setTriggerCenterMap] = useState(true);
  const { filter } = stateContext;

  const [satellite, setSatellite] = useState(false);

  const [firstInit, setFirtstInit] = useState(false);

  const history = useHistory();
  let query = useQuery();

  const matchesDesktop = useDesktop();

  const location = useLocation();
  const handleTriggerCenterMap = () => {
    setTriggerCenterMap((prevState) => !prevState);
  };

  // add filter on initial load if existant in querySearch
  useEffect(() => {
    let queryParams = [];
    let filterObj = {};
    FILTERNAME_CATEGORY_NAMES.forEach((filter) => {
      const queryString = query.get(filter.filterName);
      if (queryString) {
        filterObj[filter.filterName] = queryString;
        queryParams.push(filterObj);
      }
    });
    if (queryParams.length > 0) {
      queryParams.forEach((queryParam) => {
        setStateContext({
          ...stateContext,
          filter: queryParam,
        });
      });
    }
    // eslint-disable-next-line
  }, []);

  function sortByLat(reportsToSort) {
    return reportsToSort.sort((a, b) => {
      if (a.location[0].lat > b.location[0].lat) {
        return -1;
      }
      if (a.location[0].lat < b.location[0].lat) {
        return 1;
      }
      return 0;
    });
  }

  const { admins } = useAdmins(stateContext.authToken, stateContext.queryTrigger);

  let { reports } = useReports(stateContext.authToken, stateContext.queryTrigger, filter);

  // const handleMapChange = () => {
  //   setSatellite(!satellite);
  // };

  useEffect(() => {
    if (reports) {
      if (query.get("report")) {
        // clear query if id doesn't exist
        if (!getReportById(parseInt(query.get("report")))) {
          history.push({
            search: ``,
          });
          // set selected Report
        } else {
          setStateContext({
            ...stateContext,
            selectedReport: parseInt(query.get("report")),
          });
        }
      } else {
        setStateContext({
          ...stateContext,
          selectedReport: null,
        });
      }
    }
    // eslint-disable-next-line
  }, [query.get("report"), firstInit]);

  useEffect(() => {
    if (typeof reports !== "undefined") {
      setFirtstInit(true);
    }
  }, [reports]);

  /* Change location to focus on a report clicked coming from list page */
  useEffect(() => {
    let params = new URLSearchParams(location.search);
    let reportId = params.get("report");
    if (reportId) {
      let fullReport = getReportById(parseInt(reportId));
      if (fullReport) {
        console.dir(fullReport);
        setEditLocation(fullReport.location[Math.floor(fullReport.location.length / 2)]);
        handleTriggerCenterMap();
      }
    }
  }, []);

  // this is needed for the reports to overlap correctly
  if (reports) {
    reports = sortByLat(reports);
  }

  const handleMarkerClick = (report) => {
    history.push({
      pathname: "melder",
      search: `?report=${report.id}`,
    });
    setStateContext({
      ...stateContext,
      selectedReport: report.id,
    });

    // setStateContext({
    //   ...stateContext,
    //   selectedReport: report.id,
    //   // flyToTarget: {
    //   //   center: report.location.coordinates,
    //   //   zoom: 11,
    //   // },
    // });
  };

  const handleMarkerPopupClose = () => {
    history.push({
      search: ``,
    });
    setStateContext({
      ...stateContext,
      selectedReport: null,
    });
  };

  function getReportById(id) {
    return reports?.filter((report) => report.id === id)[0];
  }

  let userPositionMarkerPin = null;

  if (activeStep === 1) {
    userPositionMarkerPin = (
      <Box
        sx={{
          position: "absolute",
          zIndex: 1000,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -100%)",
        }}
      >
        <MarkerPin report={{ status: "new" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      >
        {stateContext.reporter.locationOption === "Standort" ? userPositionMarkerPin : null}
        <Map
          satellite={satellite}
          editLocation={editLocation}
          setCenter={setCenter}
          triggerCenterMap={triggerCenterMap}
        >
          <Route key="create-new-route" id="create-new-route" geojson={getGeoJSON([])} />
          <Redirection key="create-new-redirection" id="create-new-redirection" geojson={getGeoJSON([])} />
          {reports !== undefined
            ? reports.map(
                (report) => (
                  <Fragment key={`report-group-${report.id}`}>
                    {report.redirection && report.redirection.length > 1 ? (
                      <ReportRoute report={report} redirection />
                    ) : null}
                    {report.location && report.id && report.location.length < 2 ? (
                      !stateContext.reporter.idIfEdit || stateContext.reporter.idIfEdit !== report.id ? (
                        <ReportPOI report={report} selectedReport={stateContext.selectedReport} handleMarkerClick={handleMarkerClick} />
                      ) : null
                    ) : (
                      <ReportRoute report={report} selectedReport={stateContext.selectedReport} handleMarkerClick={handleMarkerClick} />
                    )}
                  </Fragment>
                ), // This condition hides the original marker while the report is being edited
              )
            : null}{" "}
          {stateContext.reporter && stateContext.reporter.activeStep === 1
            ? stateContext.reporter.lineCoordinates.map((coordinate, index) => (
                <CreateEditRouteMarker
                  key={`create-edit-marker${index}`}
                  coordinate={coordinate}
                  index={index}
                />
              ))
            : null}
          {stateContext.reporter && stateContext.reporter.activeStep === 2
            ? stateContext.reporter.newRedirection.map((coordinate, index) => (
                <CreateEditRouteMarker
                  key={`create-edit--redirection-marker${index}`}
                  coordinate={coordinate}
                  index={index}
                  redirection
                />
              ))
            : null}
          {userMarkerPosition && userMarkerPosition.length === 1 && activeStep !== 1 ? (
            <Marker longitude={userMarkerPosition[0].lng} latitude={userMarkerPosition[0].lat} anchor="bottom">
              <MarkerPin report={{ status: "new" }} />
            </Marker>
          ) : null}
          <Stack
            sx={{ mt: 2, ml: 2 }}
            position="absolute"
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            {/* <MapTerrainToggleButton sx={{ position: "absolute" }} onMapChange={handleMapChange} satellite={satellite} /> */}
            <SearchBar />
          </Stack>
        </Map>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              maxWidth: activeStep === 1 ? "100%" : "95vw",
              cursor: "default",
              pointerEvents: "none",
              mb: 4,
            }}
          >
            <Reporter
              sx={{
                justifyContent: "end",
              }}
              center={center}
            />
          </Box>
        </Box>
        {getReportById(stateContext.selectedReport) && stateContext.reporter.activeStep === -1 ? (
          <Card sx={matchesDesktop ? cardStylingDesktop : cardStylingMobile}>
            <ReportCard
              key={stateContext.selectedReport}
              report={getReportById(stateContext.selectedReport)}
              admins={admins}
              handleMarkerPopupClose={handleMarkerPopupClose}
              handleChangeLocation={setEditLocation}
              handleTriggerCenterMap={handleTriggerCenterMap}
            />
          </Card>
        ) : null}
      </Box>
    </Box>
  );
}
