import { useState, createContext, useContext } from "react";
import { deficiencyReporter } from "../config/deficiency-reporter";

export const StateContext = createContext({
  ...deficiencyReporter.default,
});

export const useDeficiencyContext = () => useContext(StateContext);

export function DeficiencyProvider({ children }) {
  const [deficiencyContext, setDeficiencyContext] = useState({
    ...deficiencyReporter.default,
  });

  return <StateContext.Provider value={{ deficiencyContext, setDeficiencyContext }}>{children}</StateContext.Provider>;
}
