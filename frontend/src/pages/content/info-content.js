import { Grid } from "@mui/material";
import logoHessen from "../../assets/images/logos/hessische-staatskanzlei.svg";
import logoHessenSW from "../../assets/images/logos/hessische-staatskanzlei_sw.png";
import logoDigitalesHessen from "../../assets/images/logos/digitales-hessen.svg";
import logoDigitalesHessenDark from "../../assets/images/logos/digitales-hessen-dark.svg";

import useDesktop from "../../providers/use-desktop";
import { useTheme } from "@emotion/react";

export function InfoContent() {
  const matchesDesktop = useDesktop();
  const theme = useTheme();

  return (
    <div>
      <Grid container spacing={matchesDesktop ? 7 : 3}>
        <Grid item md={12} lg={12} xl={12}>
          <p>
            Auf den Punkt informiert sind Sie mit unserem Dashboard. Darin erhalten Sie Informationen über geplante,
            laufende und abgeschlossene Maßnahmen, aktuell notwendige Umleitungen und weitere Informationen über
            <strong>„Hifäller“</strong> Maßnahmen, damit Sie stets im Bilde bleiben. Die Bezeichnung „Hifäller“ steht
            hierbei für „Hünfelder“ in Rhöner Mundart.
            <br />
            <br />
            Darüber hinaus stellen wir Ihnen einen <strong>Mängelmelder</strong> zur Verfügung. <br />
            Wir können nicht überall zur gleichen Zeit sein. Sie können uns damit helfen, mögliche Gefahrenpunkte zu
            beseitigen, Beschädigungen schneller zu erkennen und unsere Stadtbild zu pflegen, egal ob in den
            liebenswerten Dörfern, die zu Hünfeld gehören, oder in der Kernstadt. Helfen Sie mit, dass Hünfeld das
            lebenswerte und pulsierende Mittelzentrum im Biospährenreservart Rhön bleibt. Damit gewinnen wir alle.
          </p>
          <br />
          <p>
            Im Rahmen der Smart-City Konzeption hat die Stadt Hünfeld damit ein „Anregungs- und
            Ereignismanagementsystem“ zur Verfügung gestellt. Mit Hilfe dieser Onlineplattform erhält die Bevölkerung
            eine komfortable, digitale Möglichkeit zur Meldung von Schäden, Störungen oder Verschmutzungen.{" "}
          </p>
          <br />
          <Grid container spacing={matchesDesktop ? 4 : 3} alignItems="center">
            <Grid item xl={4} lg={5} md={6} s={6} xs={12}>
              <img
                src={theme.palette.mode === "light" ? logoHessen : logoHessenSW}
                width={"80%"}
                alt="Hessen Logo"
                style={{
                  borderRadius: 2,
                  marginTop: 10,
                }}
              />
            </Grid>
            <Grid item xl={4} lg={5} md={6} s={6} xs={12}>
              <img
                src={theme.palette.mode === "light" ? logoDigitalesHessen : logoDigitalesHessenDark}
                width={"80%"}
                alt="Digitales Hessen Logo"
                style={{
                  borderRadius: 2,
                  marginTop: 20,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
