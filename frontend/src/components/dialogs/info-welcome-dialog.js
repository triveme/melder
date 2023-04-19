import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useTheme } from "@emotion/react";

import placeholderLogo from "../../assets/images/logos/InfoPin_weiss.svg";
import placeholderLogoBlack from "../../assets/images/logos/InfoPin_blau.svg";

export function InfoWelcomeDialog({ openWelcomeText, handleCloseWelcomeText }) {
  const theme = useTheme();

  return (
    <Dialog maxWidth="xs" open={openWelcomeText} onClose={handleCloseWelcomeText}>
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          direction: "columns",
          m: 2,
        }}
      >
        {" "}
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mr: 2 }}>
            <img
              src={theme.palette.mode === "light" ? placeholderLogoBlack : placeholderLogo}
              style={{
                width: "200px",
              }}
              alt="Logo"
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h5">Herzlich Willkommen!</Typography>
            <p>
              InfoPin Hünfeld - Informationen auf den Punkt: Mit unserem neuen Dashboard wollen wir Sie über geplante,
              laufende und abgeschlossene Bau- sowie über weitere relevante Maßnahmen in unserem Stadtgebiet
              informieren. Das funktioniert ganz einfach mittels einer interaktiven Karte, über welche die Informationen
              zu den einzelnen Maßnahmen sowie der aktuelle Status schnell, einfach und punktgenau abgerufen werden
              können. Darüber hinaus bietet Ihnen das Dashboard die Möglichkeit, selbst aktiv mögliche Probleme, Mängel
              und Schäden im Stadtgebiet zu kartografieren und entsprechende Informationen umgehend an die
              Stadtverwaltung weiterzugeben. Damit helfen Sie uns dabei, die Beseitigung von Müllablagerungen zu
              beschleunigen oder auf akute Gefahrenlagen schnell und effizient reagieren zu können. Mit dem Dashboard
              „InfoPin Hünfeld“ profitieren Sie, die gesamte Bürgerschaft und wir als Stadt Hünfeld gleichermaßen –
              immer auf dem neuesten Stand, immer aktuell und immer auf den Punkt informiert.
            </p>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button onClick={handleCloseWelcomeText} variant="contained">
          Schliessen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
