import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { client } from "../clients/client";
import { useStateContext } from "../providers/state-provider";
import { prettifyDate } from "../utils/date-utils";

export function SenorPage() {
  const { stateContext } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [glassContainerLevelData, setGlassContainerLevelData] = useState([]);

  useEffect(() => {
    setLoading(true);
    client
      .get("/sensors/glass-container-levels", {
        headers: {
          "x-access-token": stateContext.authToken,
        },
      })
      .then((response) => {
        if (response?.data) {
          setGlassContainerLevelData(response.data);
          setErrorMessage(null);
        } else {
          setGlassContainerLevelData([]);
          setErrorMessage("Keine Daten vorhanden.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(
          err?.response?.data?.message ||
            "Sensordaten können momentan nicht abgerufen werden. Bitte versuchen Sie es später erneut.",
        );
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Typography variant="h2" noWrap marginLeft={2} marginBottom={5} marginTop={5} fontWeight={600} fontSize={24}>
        Sensordaten
      </Typography>
      <Typography variant="h3" noWrap marginLeft={2} fontWeight={600} fontSize={20}>
        Füllstände Glascontainer
      </Typography>
      <Box sx={{ flexGrow: 1, display: "flex", marginLeft: 2, padding: 3 }}>
        <Grid container spacing={2}>
          {loading ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            glassContainerLevelData.map((data) => (
              <Grid item xs={12} sm={6} md={3} key={data.address}>
                <Paper sx={{ p: 2, height: "fit-content" }} variant="outlined">
                  <p>Adresse: {data.address}</p>
                  <p>Füllstand: {data.level}%</p>
                  <p>Messdatum: {prettifyDate(data.timestamp)}</p>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </>
  );
}
