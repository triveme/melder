import { Fragment, useEffect, useState } from "react";

import { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useHistory, useLocation } from "react-router-dom";

import useSupercluster from "use-supercluster";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TopNavigation from "@mui/material/BottomNavigation";
import TopNavigationAction from "@mui/material/BottomNavigationAction";

import { Map } from "../components/map";
import { ClimateReporter } from "../components/reporter/climate-reporter";
import map from "../config/map";
import { useAdmins } from "../clients/admin-client";
import { useClimateProjects } from "../clients/climate-project-client";
import { useStateContext } from "../providers/state-provider";
import { ClimateProjectCard } from "../components/climate-project-card";
import { MarkerPin } from "../elements/marker-pin";
import useDesktop from "../providers/use-desktop";
import { useQuery } from "../providers/query-params-provider";
import SearchBar from "../components/reporter/search-bar";
import { ClimateProjectPoi } from "../components/mapComponents/climate-project-poi";
import { CLIMATE_ADJUSTMENT_CATEGORIES, CLIMATE_PROTECTION_CATEGORIES } from "../constants";
import { Paper } from "@mui/material";
import { getDisplayNameAndCategoryFromFilterName } from "../constants";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

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

export function ClimatePage() {
  const { stateContext, setStateContext } = useStateContext();
  const { activeStep, userMarkerPosition } = stateContext.climateReporter;
  const [editLocation, setEditLocation] = useState({ lat: "", lng: "" });
  const [center, setCenter] = useState(map.center);
  const [triggerCenterMap, setTriggerCenterMap] = useState(true);
  const [projectToZoomIn, setProjectToZoomIn] = useState(null);
  const { previousPathname } = stateContext;

  const history = useHistory();
  const query = useQuery();

  const matchesDesktop = useDesktop();

  const location = useLocation();
  const handleTriggerCenterMap = () => {
    setTriggerCenterMap((prevState) => !prevState);
  };

  const queryString = query.toString();
  const climateProjectId = query.get("klima-projekt");

  useEffect(() => {
    const searchParams = new URLSearchParams(query);

    if (
      (previousPathname && previousPathname !== "/klima" && previousPathname !== "/meldungen") ||
      queryString.length === 0
    ) {
      searchParams.append("zeithorizont", "kurzfristig");
      searchParams.append("zeithorizont", "mittelfristig");
      searchParams.append("zeithorizont", "langfristig");
      searchParams.append("zeithorizont", "archiv");
      CLIMATE_PROTECTION_CATEGORIES.forEach((category) =>
        searchParams.append(category.filterCategory, category.filterName),
      );
      CLIMATE_ADJUSTMENT_CATEGORIES.forEach((category) =>
        searchParams.append(category.filterCategory, category.filterName),
      );
      history.replace({
        pathname: "klima",
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

  let { climateProjects } = useClimateProjects(stateContext.authToken, stateContext.queryTrigger, query);

  // split the climateProjects into two arrays:
  // One for normal projects having location with lat and lng
  // One for special projects having locationText instead of location
  let specialClimateProjects = [];
  let normalClimateProjects = [];
  climateProjects?.forEach((project) => {
    if (project.locationText) {
      specialClimateProjects.push(project);
    } else {
      normalClimateProjects.push(project);
    }
  });

  /* Change location to focus on a climateProject clicked coming from list page */
  useEffect(() => {
    if (projectToZoomIn || (climateProjectId && previousPathname === "/meldungen")) {
      const fullProject = getClimateProjectById(projectToZoomIn || climateProjectId);
      if (fullProject) {
        if (fullProject.location && !fullProject.locationText) {
          setEditLocation(fullProject.location[Math.floor(fullProject.location.length / 2)]);
          handleTriggerCenterMap();
        }
        setProjectToZoomIn(null);
      } else {
        setProjectToZoomIn(climateProjectId);
      }
    }
  }, [climateProjectId, previousPathname, projectToZoomIn, normalClimateProjects]);

  const handleViewClick = (tab) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("ansicht", tab === 0 ? "standortbezogen" : "standortuebergreifend");
    history.replace({
      pathname: "klima",
      search: searchParams.toString(),
    });
  };

  const handleProjectClick = (project) => {
    const searchParams = new URLSearchParams(query);
    searchParams.set("klima-projekt", project.id);
    history.push({
      pathname: "klima",
      search: searchParams.toString(),
    });
  };

  const handleMarkerPopupClose = () => {
    const searchParams = new URLSearchParams(query);
    searchParams.delete("klima-projekt");
    history.push({
      pathname: "klima",
      search: searchParams.toString(),
    });
  };

  function getClimateProjectById(id) {
    const foundProjects = climateProjects?.filter((project) => project.id == id);
    return foundProjects && foundProjects.length > 0 ? foundProjects[0] : null;
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
        <MarkerPin element={{ status: "new" }} category="climate" />
      </Box>
    );
  }

  const climateProjectView = query.get("ansicht") === "standortuebergreifend" ? 1 : 0;

  // ensure only the climate projects of the active view can be shown in detail
  useEffect(() => {
    if (climateProjectId) {
      const selectedProject = getClimateProjectById(climateProjectId);
      const searchParams = new URLSearchParams(query);
      if (
        selectedProject &&
        ((climateProjectView === 0 && selectedProject.locationText) ||
          (climateProjectView === 1 && !selectedProject.locationText))
      ) {
        searchParams.delete("klima-projekt");
        history.replace({
          pathname: "klima",
          search: searchParams.toString(),
        });
      }
    }
  }, [climateProjectView, climateProjectId]);

  function mapLatLngObjectToArray(latLngObject) {
    return [latLngObject.lng, latLngObject.lat];
  }

  const geoClimateProjects = normalClimateProjects
    ? normalClimateProjects.map((project) => ({
        type: "Feature",
        properties: {
          id: project.id,
          cluster: false,
          projectData: project,
        },
        geometry: {
          type: "Point",
          coordinates: mapLatLngObjectToArray(project.location[0]),
        },
      }))
    : [];

  const { clusters, supercluster } = useSupercluster({
    points: geoClimateProjects,
    bounds: stateContext.mapBounds,
    zoom: stateContext.mapViewState.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: "title", label: "Titel", minWidth: 150 },
    { id: "area", label: "Gebiet", minWidth: 100 },
    { id: "category", label: "Kategorie", minWidth: 100 },
    { id: "subCategory", label: "Subkategorie", minWidth: 100 },
    { id: "timeHorizon", label: "Zeithorizont", minWidth: 100 },
  ];
  const rows = specialClimateProjects.map((project) => {
    const { displayName, category } = getDisplayNameAndCategoryFromFilterName(project.category);
    return {
      id: project.id,
      title: project.title,
      area: project.locationText,
      category: category,
      subCategory: displayName,
      timeHorizon: project.timeHorizon.charAt(0).toUpperCase() + project.timeHorizon.slice(1),
      _project: project,
    };
  });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {matchesDesktop ? null : (
        <Box sx={{ position: "relative", zIndex: 10 }}>
          <Box sx={{ position: "absolute", left: "50%", transform: "translate(-50%)" }}>
            <TopNavigation
              showLabels
              value={climateProjectView}
              onChange={(event, newValue) => {
                handleViewClick(newValue);
              }}
              sx={{
                position: "relative",
                right: "1px",
                height: "32px",
                width: "100vw",
                boxShadow: "0 0 0 1px rgba(16,22,26,.1), 0 4px 8px rgba(16,22,26,.2)",
                opacity: activeStep > 0 ? 0.6 : 1,
              }}
            >
              <TopNavigationAction label="Standortbezogen" sx={{ maxWidth: "fit-content" }} disabled={activeStep > 0} />
              <TopNavigationAction
                label="Standortübergreifend"
                sx={{ maxWidth: "fit-content" }}
                disabled={activeStep > 0}
              />
            </TopNavigation>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          width: "100%",
          height: matchesDesktop ? "100%" : "calc(100% - 32px)",
          top: matchesDesktop ? 0 : "32px",
          position: "absolute",
        }}
      >
        {climateProjectView === 1 ? (
          <Paper
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 9,
              borderRadius: 0,
            }}
          >
            <Box sx={matchesDesktop ? { padding: 5 } : {}}>
              <TableContainer style={{ maxHeight: "calc(100vh - 236px)" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleProjectClick(row._project)}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number" ? column.format(value) : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Pro Seite:"
              />
            </Box>
          </Paper>
        ) : null}
        {matchesDesktop ? (
          <Box sx={{ position: "relative", zIndex: 10 }}>
            <Box sx={{ position: "absolute", left: "50%", transform: "translate(-50%)" }}>
              <TopNavigation
                showLabels
                value={climateProjectView}
                onChange={(event, newValue) => {
                  handleViewClick(newValue);
                }}
                sx={{
                  height: "40px",
                  width: "fit-content",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  boxShadow: "0 0 0 1px rgba(16,22,26,.1), 0 4px 8px rgba(16,22,26,.2)",
                  opacity: activeStep > 0 ? 0.6 : 1,
                }}
              >
                <TopNavigationAction
                  label="Standortbezogen"
                  sx={{ maxWidth: "fit-content" }}
                  disabled={activeStep > 0}
                />
                <TopNavigationAction
                  label="Standortübergreifend"
                  sx={{ maxWidth: "fit-content" }}
                  disabled={activeStep > 0}
                />
              </TopNavigation>
            </Box>
          </Box>
        ) : null}
        {climateProjectView === 0 ? userPositionMarkerPin : null}
        <Map satellite={false} editLocation={editLocation} setCenter={setCenter} triggerCenterMap={triggerCenterMap}>
          {clusters.map((cluster) => {
            const { cluster: isCluster, point_count: pointCount, projectData: project } = cluster.properties;

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
                      width: `${10 + (pointCount / geoClimateProjects.length) * 20}px`,
                      height: `${10 + (pointCount / geoClimateProjects.length) * 20}px`,
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
              <Fragment key={`climateProject-group-${project.id}`}>
                {project.location && project.id && project.location.length < 2 ? (
                  !stateContext.climateReporter.idIfEdit || stateContext.climateReporter.idIfEdit !== project.id ? (
                    <ClimateProjectPoi climateProject={project} handleMarkerClick={handleProjectClick} />
                  ) : null
                ) : null}
              </Fragment>
            );
          })}
          {userMarkerPosition && userMarkerPosition.length === 1 && activeStep !== 1 ? (
            <Marker longitude={userMarkerPosition[0].lng} latitude={userMarkerPosition[0].lat} anchor="bottom">
              <MarkerPin element={{ status: "new" }} category="climate" />
            </Marker>
          ) : null}
          <SearchBar mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN} position="top-left" />
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
            <ClimateReporter
              sx={{
                justifyContent: "end",
                zIndex: 12,
              }}
              center={center}
            />
          </Box>
        </Box>
        {getClimateProjectById(climateProjectId) && stateContext.climateReporter.activeStep === -1 ? (
          <Card sx={matchesDesktop ? cardStylingDesktop : cardStylingMobile}>
            <ClimateProjectCard
              key={climateProjectId}
              climateProject={getClimateProjectById(climateProjectId)}
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
