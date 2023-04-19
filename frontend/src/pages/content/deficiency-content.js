import { Grid, Typography } from "@mui/material";
import { Button } from "@mui/material";

import useDesktop from "../../providers/use-desktop";
import { Alert, AlertTitle } from "@mui/material";
import { useDeficiencyContext } from "../../providers/deficiency-provider";
import { useTheme } from "@emotion/react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArticleIcon from "@mui/icons-material/Article";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import CrisisAlertOutlinedIcon from "@mui/icons-material/CrisisAlertOutlined";

export function DeficiencyInfoContent() {
  const matchesDesktop = useDesktop();
  const theme = useTheme();
  const { deficiencyContext, setDeficiencyContext } = useDeficiencyContext();

  const handleAddDeficiency = () => {
    setDeficiencyContext({ ...deficiencyContext, activeStep: 0 });
  };

  return (
    <div>
      <Grid container spacing={matchesDesktop ? 13 : 3}>
        <Grid item xs={12} s={12} md={12} lg={6} xl={8}>
          <Typography variant="p" fontSize={17}>
            {" "}
            Mit der Nutzung dieses Mängelmelders helfen Sie uns, schneller und zielgerichteter Schäden zu beheben und Mängel 
            zu beseitigen. Ihre Meldung geht direkt an den jeweils zuständigen Fachbereich in der Stadtverwaltung Hünfeld, 
            der sich dann darum kümmern kann. Je schneller die Information vorliegt, umso zügiger kann darauf reagiert werden. 
            Wenn Sie möchten, können sie auch ihre Telefonnummer für eventuelle Rückfragen angeben.
            <Alert
              severity="info"
              sx={{ marginTop: 4 }}
              variant={theme.palette.mode === "dark" ? "outlined" : "standard"}
            >
              <AlertTitle sx={{ fontWeight: 600 }}>Bitte melden Sie keine akuten Notfälle oder Gefährdungen</AlertTitle>
              In derartigen Fällen ist die Polizei (110) bzw. die Feuerwehr (112) Ihr Ansprechpartner
            </Alert>
          </Typography>
        </Grid>
        <Grid item xs={12} s={12} md={12} lg={6} xl={4}>
          <Button
            variant="contained"
            sx={{ p: 5, mb: 5, borderRadius: 5, width: "100%", height: "100%" }}
            onClick={handleAddDeficiency}
          >
            {" "}
            <CrisisAlertOutlinedIcon sx={{ fontSize: 80, m: 3 }} />
            <Typography fontSize={20} sx={{ mr: 3 }}>
              {" "}
              Mängel <br /> übermitteln
            </Typography>
          </Button>
        </Grid>
        {/* <Grid item md={6} lg={6} xl={3}>
          <img
            src={infoImage}
            style={{
              width: "400px",
              height: "250px",
              borderRadius: 15,
              objectFit: "cover",
            }}
            alt="Vorschau Mängel melden"
          />
        </Grid> */}
      </Grid>
    </div>
  );
}

export function DeficiencyContentStep1() {
  const matchesDesktop = useDesktop();

  return (
    <Typography variant="p" fontSize={17}>
      <Grid container spacing={matchesDesktop ? 7 : 3} alignItems="center">
        <Grid item lg={12} md={3} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          {" "}
          <div>
            <LocationOnIcon sx={{ fontSize: "150px" }} color="primary" />
          </div>
        </Grid>

        <Grid item lg={12} md={9} sm={12} xs={12}>
          <Typography variant="h5">
            Schritt 1: <strong>Standort bestimmen</strong>
          </Typography>
          <br />
          Übermitteln Sie uns den Standort, am dem der Mangel festgestellt wurde.
          <br /> <br /> Hierfür gibt es drei Möglichkeiten:
          <ul>
            <li>Adresseingabe</li>
            <li>Standort mithilfe der Karte bestimmen</li>
            <li>(aktuellen) Standort ermitteln</li>
          </ul>
          <br />
        </Grid>
      </Grid>
    </Typography>
  );
}

export function DeficiencyContentStep2() {
  const matchesDesktop = useDesktop();

  return (
    <Grid container spacing={matchesDesktop ? 7 : 3} alignItems="center">
      <Grid item lg={12} md={3} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        {" "}
        <div>
          <ArticleIcon sx={{ fontSize: "150px" }} color="primary" />
        </div>
      </Grid>
      <Grid item lg={12} md={9} sm={12} xs={12}>
        <Typography variant="h5">
          Schritt 2: <strong>Mängel beschreiben</strong>{" "}
        </Typography>
        <Typography variant="p" fontSize={17}>
          <br />
          Um die Meldung an die zuständige Stelle weiterleiten zu können, soll die Meldung einer passenden Kategorie
          zugeordnet werden. Zudem kann in diesem Schritt der Mangel genauer beschrieben werden. Optional können Bilder
          des Mangels angefügt werden.
          <ul>
            <li>Auswahl der passenden Mängelkategorie</li>
            <li>Hinzufügen von Bildern (optional)</li>
            <li>Mängel beschreiben</li>
          </ul>
        </Typography>
      </Grid>
    </Grid>
  );
}

export function DeficiencyContentStep3() {
  const matchesDesktop = useDesktop();

  return (
    <Typography variant="p" fontSize={17}>
      <Grid container spacing={matchesDesktop ? 7 : 3} alignItems="center">
        <Grid item lg={12} md={3} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          {" "}
          <div>
            <PermContactCalendarIcon sx={{ fontSize: "150px" }} color="primary" />
          </div>
        </Grid>
        <Grid item lg={12} md={9} sm={12} xs={12}>
          <Typography variant="h5">
            Schritt 3: <strong>Kontaktdaten</strong>{" "}
          </Typography>
          <br />
          Im letzten Schritt bitten wir Sie für weitere Rückfragen Kontaktmöglichkeiten zu hinterlegen. Außerdem müssen
          der Datenverarbeitung und der Datenschutzerklärung zugestimmt werden.
          <ul>
            <li>E-Mail</li>
            <li>Telefonnummer (optional)</li>
            <li>Datenverarbeitung & Datenschutzerklärung zustimmen</li>
          </ul>
        </Grid>
      </Grid>
    </Typography>
  );
}

export function DeficiencyAdditionalInfoContent() {
  const matchesDesktop = useDesktop();

  return (
    <div>
      <Grid container spacing={matchesDesktop ? 7 : 3}>
        <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
          <Typography variant="p" fontSize={17}>
            {" "}
            Die Daten mit den von Ihnen übermittelten Informationen zu den Mängeln werden an die entsprechenden 
            Fachbereiche der Stadt Hünfeld direkt übermittelt und bearbeitet. Über die Angabe Ihrer E-Mail Adresse 
            und optional Ihrer Telefonnummer haben unserer Mitarbeiter die Möglichkeit, sich bei eventuellen 
            Rückfragen mit Ihnen in Verbindung zu setzen. Damit helfen Sie uns, schnell tätig zu werden. <br />
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
