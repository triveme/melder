import { useState, createContext, useContext } from "react";

import jwt_decode from "jwt-decode";

import { CONSTRUCTION_REPORTER, CLIMATE_REPORTER } from "../config/reporter";
import map from "../config/map";

const authToken = sessionStorage.getItem("authToken");

export const StateContext = createContext({
  authToken: authToken ? authToken : null,
  adminId: authToken ? jwt_decode(authToken).id : null,
  adminPermissions: authToken ? jwt_decode(authToken).permissions : "none",
  queryTrigger: 0,
  reporter: CONSTRUCTION_REPORTER.default,
  climateReporter: CLIMATE_REPORTER.default,
  location: null,
  address: "",
  previousPathname: null,
  openFilterGroup: null,
  mapBounds: null,
  mapViewState: {
    latitude: map.center.lat,
    longitude: map.center.lng,
    zoom: map.zoom,
  },
});

export const useStateContext = () => useContext(StateContext);

export function StateProvider({ children }) {
  const [stateContext, setStateContext] = useState({
    authToken: authToken ? authToken : null,
    adminId: authToken ? jwt_decode(authToken).id : null,
    adminPermissions: authToken ? jwt_decode(authToken).permissions : "none",
    queryTrigger: 0,
    reporter: CONSTRUCTION_REPORTER.default,
    climateReporter: CLIMATE_REPORTER.default,
    location: null,
    address: "",
    previousPathname: null,
    openFilterGroup: null,
    mapBounds: null,
    mapViewState: {
      latitude: map.center.lat,
      longitude: map.center.lng,
      zoom: map.zoom,
    },
  });

  return <StateContext.Provider value={{ stateContext, setStateContext }}>{children}</StateContext.Provider>;
}
