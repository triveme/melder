import { useState, useRef, useEffect } from "react";

import MapGL, { NavigationControl } from "react-map-gl";

import { useHistory } from "react-router-dom";
import { useGeoCoder } from "../clients/geocoder-client";

import map from "../config/map";
import { selectableArea } from "../data/SelectableArea";
import { useStateContext } from "../providers/state-provider";
import { useColorModeContext } from "../providers/theme-provider";
import { coordinatesInsidePolygon } from "../utils/position-utils";
import { MunicipalBoundaries, BoundariesHuenfeld } from "./municipal-boundaries";
import { Area } from "./municipal-boundaries";
import { getGeoJSON } from "../utils/location-utils";
import { useDeficiencyContext } from "../providers/deficiency-provider";

export function Map({ children, editLocation, setCenter, satellite, triggerCenterMap }) {
  const { colorMode } = useColorModeContext();
  const { stateContext, setStateContext } = useStateContext();
  const { address, triggerAddressSearch } = stateContext;
  const { deficiencyContext } = useDeficiencyContext();
  const { location, triggerCenter } = deficiencyContext;
  const mapRef = useRef();
  const history = useHistory();
  const geoCoder = useGeoCoder(address);

  const [viewState, setViewState] = useState({
    latitude: map.center.lat,
    longitude: map.center.lng,
    zoom: map.zoom,
  });

  // recenter if new coordinates from search
  useEffect(() => {
    if (
      geoCoder.data &&
      geoCoder.data.length > 1 &&
      coordinatesInsidePolygon({ lng: geoCoder.data[0], lat: geoCoder.data[1] }, selectableArea)
    ) {
      setViewState({
        longitude: geoCoder.data[0],
        latitude: geoCoder.data[1],
        zoom: 15.95,
      });
      setCenter({ lng: geoCoder.data[0], lat: geoCoder.data[1] });
    }
    // eslint-disable-next-line
  }, [geoCoder.data, triggerAddressSearch]);

  /** center map on pin, when admin wants to edit report */
  useEffect(() => {
    if (editLocation && editLocation.lat && editLocation.lng) {
      setViewState({
        longitude: editLocation.lng,
        latitude: editLocation.lat,
        zoom: 16.95,
      });
      setCenter({ lng: editLocation.lng, lat: editLocation.lat });
    }
    // eslint-disable-next-line
  }, [triggerCenterMap]);

  /** center map on pin when getting user location (creating-deficiency) */
  useEffect(() => {
    if (location && location.lat && location.lng) {
      setViewState({
        longitude: location.lng,
        latitude: location.lat,
        zoom: 14.95,
      });
      setCenter({ lng: location.lng, lat: location.lat });
    }
    // eslint-disable-next-line
  }, [triggerCenter]);

  const handleMapClick = (e) => {
    if (e.originalEvent?.target?.className === "mapboxgl-canvas") {
      // setStateContext({
      //   ...stateContext,
      //   selectedReport: null,
      // });
      history.push({
        search: ``,
      });
    }

    if (stateContext.reporter.activeStep === 1 && stateContext.reporter.locationOption === "Strecke") {
      setStateContext({
        ...stateContext,
        reporter: {
          ...stateContext.reporter,
          lineCoordinates: [...stateContext.reporter.lineCoordinates, e.lngLat],
        },
      });
    }

    if (stateContext.reporter.activeStep === 2 && stateContext.reporter.hasRedirection) {
      setStateContext({
        ...stateContext,
        reporter: {
          ...stateContext.reporter,
          newRedirection: [...stateContext.reporter.newRedirection, e.lngLat],
        },
      });
    }
  };

  const handleMoveEnd = () => {
    if (mapRef.current) {
      setCenter(mapRef.current.getCenter());
    }
  };

  const updateLineLayer = (sourceName) => {
    if (mapRef.current && mapRef.current.getSource(sourceName)) {
      mapRef.current.getSource(sourceName).setData(getGeoJSON(stateContext.reporter.lineCoordinates));
    }
  };

  useEffect(() => {
    if (stateContext.reporter.idIfEdit) {
      updateLineLayer(`route-${stateContext.reporter.idIfEdit}`);
    } else {
      updateLineLayer("create-new-route");
    }
    // eslint-disable-next-line
  }, [stateContext.reporter.lineCoordinates, stateContext.reporter.lineCoordinates.length]);

  const updateRedirectionLayer = (sourceName) => {
    if (mapRef.current && mapRef.current.getSource(sourceName)) {
      mapRef.current.getSource(sourceName).setData(getGeoJSON(stateContext.reporter.newRedirection));
    }
  };

  useEffect(() => {
    if (stateContext.reporter.idIfEdit) {
      updateRedirectionLayer(`redirection-${stateContext.reporter.idIfEdit}`);
    } else {
      updateRedirectionLayer("create-new-redirection");
    }
    // eslint-disable-next-line
  }, [stateContext.reporter.newRedirection, stateContext.reporter.newRedirection.length]);

  // // flies to marker location on click
  // const flyToTarget = stateContext.flyToTarget;
  // if (flyToTarget) {
  //   if (mapRef.current) {
  //     mapRef.current.easeTo({
  //       center: flyToTarget.center,
  //       zoom: flyToTarget.zoom,
  //     });

  //     mapRef.current.on("moveend", () => {
  //       setStateContext({
  //         ...stateContext,
  //         flyToTarget: null,
  //       });
  //     });
  //   }
  // }

  return (
    <MapGL
      {...viewState}
      // reuseMaps={true}
      maxBounds={map.outerBounds}
      minZoom={map.zoom}
      ref={mapRef}
      dragRotate={false}
      width="100%"
      height="100%"
      mapStyle={
        colorMode === "dark"
          ? "mapbox://styles/stadthuenfeld/cl6q70nhc000a14o5t9jeqerx"
          : "mapbox://styles/stadthuenfeld/cl6q6x0gh002u14n0bztjcm2d"
      }
      onMove={(e) => setViewState(e.viewState)}
      onMoveEnd={handleMoveEnd}
      onClick={handleMapClick}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
    >
      <Area satellite={satellite} />
      <MunicipalBoundaries satellite={satellite} />
      <BoundariesHuenfeld satellite={satellite} />
      <NavigationControl 
        showCompass={false}
        style={{
          position: "relative",
          top: "22px"
        }}
      />
      {children}
    </MapGL>
  );
}
