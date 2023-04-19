import { useState, createContext, useContext } from "react";

import jwt_decode from "jwt-decode";

import { reporter } from "../config/reporter";

const authToken = sessionStorage.getItem("authToken");

export const StateContext = createContext({
  authToken: authToken ? authToken : null,
  adminId: authToken ? jwt_decode(authToken).id : null,
  selectedReport: null,
  // flyToTarget: null,
  queryTrigger: 0,
  reporter: reporter.default,
  filter: {},
  address: "",
  triggerAddressSearch: false,
});

export const useStateContext = () => useContext(StateContext);

export function StateProvider({ children }) {
  const [stateContext, setStateContext] = useState({
    authToken: authToken ? authToken : null,
    adminId: authToken ? jwt_decode(authToken).id : null,
    selectedReport: null,
    // flyToTarget: null,
    queryTrigger: 0,
    reporter: reporter.default,
    filter: {},
    address: "",
    triggerAddressSearch: false,
  });

  return <StateContext.Provider value={{ stateContext, setStateContext }}>{children}</StateContext.Provider>;
}
