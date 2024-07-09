import { Fragment, useEffect, useState } from "react";

import { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useHistory, useLocation } from "react-router-dom";

import useSupercluster from "use-supercluster";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Stack } from "@mui/material";

import { Map } from "../components/map";
import { Reporter } from "../components/reporter/reporter";
import map from "../config/map";
import { useAdmins } from "../clients/admin-client";
import { useReports } from "../clients/report-client";
import { useStateContext } from "../providers/state-provider";
import { ReportCard } from "../components/report-card";
import { MarkerPin } from "../elements/marker-pin";
import useDesktop from "../providers/use-desktop";
import { useQuery } from "../providers/query-params-provider";
import { CONSTRUCTION_CATEGORIES, FILTERNAME_CATEGORY_NAMES, TIME_FRAMES } from "../constants";
import SearchBar from "../components/reporter/search-bar";
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
  const [reportToZoomIn, setReportToZoomIn] = useState(null);
  const { previousPathname } = stateContext;

  const history = useHistory();
  const query = useQuery();

  const matchesDesktop = useDesktop();

  const location = useLocation();
  const handleTriggerCenterMap = () => {
    setTriggerCenterMap((prevState) => !prevState);
  };

  const reportId = query.get("report");
  const queryString = query.toString();

  useEffect(() => {
    const searchParams = new URLSearchParams(query);

    if (
      (previousPathname && previousPathname !== "/melder" && previousPathname !== "/meldungen") ||
      queryString.length === 0
    ) {
      searchParams.append(FILTERNAME_CATEGORY_NAMES[0].filterName, CONSTRUCTION_CATEGORIES[0].filterName);
      searchParams.append(FILTERNAME_CATEGORY_NAMES[0].filterName, CONSTRUCTION_CATEGORIES[1].filterName);
      searchParams.append(FILTERNAME_CATEGORY_NAMES[0].filterName, CONSTRUCTION_CATEGORIES[2].filterName);
      searchParams.append(FILTERNAME_CATEGORY_NAMES[1].filterName, TIME_FRAMES[0].filterName);
      searchParams.append(FILTERNAME_CATEGORY_NAMES[1].filterName, TIME_FRAMES[1].filterName);
      history.replace({
        pathname: "melder",
        search: searchParams.toString(),
      });
    }

    setStateContext((prevStateContext) => {
      return {
        ...prevStateContext,
        previousPathname: location.pathname,
      };
    });
  }, [queryString]);

  const { admins } = useAdmins(stateContext.authToken, stateContext.queryTrigger, stateContext.adminPermissions);

  let { reports } = useReports(stateContext.authToken, stateContext.queryTrigger, query);

  /* Change location to focus on a report clicked coming from list page */
  useEffect(() => {
    if (reportToZoomIn || (reportId && previousPathname === "/meldungen")) {
      const fullReport = getReportById(reportToZoomIn || reportId);
      if (fullReport) {
        setEditLocation(fullReport.location[Math.floor(fullReport.location.length / 2)]);
        handleTriggerCenterMap();
        setReportToZoomIn(null);
      } else {
        setReportToZoomIn(reportId);
      }
    }
  }, [reportId, previousPathname, reportToZoomIn, reports]);

  const handleMarkerClick = (report) => {
    const searchParams = new URLSearchParams(query);
    searchParams.set("report", report.id);
    history.push({
      pathname: "melder",
      search: searchParams.toString(),
    });
  };

  const handleMarkerPopupClose = () => {
    const searchParams = new URLSearchParams(query);
    searchParams.delete("report");
    history.push({
      pathname: "melder",
      search: searchParams.toString(),
    });
  };

  function getReportById(reportId) {
    return reports?.filter((report) => report.id == reportId)[0];
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
        <MarkerPin element={{ status: "new" }} category="construction" />
      </Box>
    );
  }

  function mapLatLngObjectToArray(latLngObject) {
    return [latLngObject.lng, latLngObject.lat];
  }

  const geoReports = reports
    ? reports.map((report) => {
        return {
          type: "Feature",
          properties: {
            id: report.id,
            cluster: false,
            reportData: report,
          },
          geometry: {
            type: "Point",
            coordinates:
              report.location.length > 1
                ? mapLatLngObjectToArray(report.location[Math.floor(report.location.length / 2)])
                : mapLatLngObjectToArray(report.location[0]),
          },
        };
      })
    : [];

  const { clusters, supercluster } = useSupercluster({
    points: geoReports,
    bounds: stateContext.mapBounds,
    zoom: stateContext.mapViewState.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

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
        <Map satellite={false} editLocation={editLocation} setCenter={setCenter} triggerCenterMap={triggerCenterMap}>
          <Route key="create-new-route" id="create-new-route" geojson={getGeoJSON([])} category="construction" />
          <Redirection key="create-new-redirection" id="create-new-redirection" geojson={getGeoJSON([])} />
          {clusters.map((cluster) => {
            const { cluster: isCluster, point_count: pointCount, reportData: report } = cluster.properties;

            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  latitude={cluster.geometry.coordinates[1]}
                  longitude={cluster.geometry.coordinates[0]}
                >
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${10 + (pointCount / geoReports.length) * 20}px`,
                      height: `${10 + (pointCount / geoReports.length) * 20}px`,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                      setStateContext((prevStateContext) => ({
                        ...prevStateContext,
                        mapViewState: {
                          ...prevStateContext.mapViewState,
                          longitude: cluster.geometry.coordinates[0],
                          latitude: cluster.geometry.coordinates[1],
                          zoom: expansionZoom,
                        },
                      }));
                    }}
                  >
                    {pointCount}
                  </div>
                </Marker>
              );
            }

            return (
              <Fragment key={`report-group-${report.id}`}>
                {report.redirection && report.redirection.length > 1 ? (
                  <ReportRoute report={report} redirection />
                ) : null}
                {report.location && report.id && report.location.length < 2 ? (
                  !stateContext.reporter.idIfEdit || stateContext.reporter.idIfEdit !== report.id ? (
                    <ReportPOI report={report} handleMarkerClick={handleMarkerClick} />
                  ) : null
                ) : (
                  <ReportRoute report={report} handleMarkerClick={handleMarkerClick} />
                )}
              </Fragment>
            );
          })}
          {stateContext.reporter && stateContext.reporter.activeStep === 1
            ? stateContext.reporter.lineCoordinates.map((coordinate, index) => (
                <CreateEditRouteMarker key={`create-edit-marker${index}`} coordinate={coordinate} index={index} />
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
              <MarkerPin element={{ status: "new" }} category="construction" />
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
            <SearchBar mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN} position="top-left" />
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
          zIndex: 12,
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
              maxHeight: "calc(100% - 32px)",
              display: "block",
              cursor: "default",
              pointerEvents: "none",
              mb: "32px",
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
        {getReportById(reportId) && stateContext.reporter.activeStep === -1 ? (
          <Card sx={matchesDesktop ? cardStylingDesktop : cardStylingMobile}>
            <ReportCard
              key={reportId}
              report={getReportById(reportId)}
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
