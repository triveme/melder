import { InfoWidget } from "../components/info-components/info-widget";
import { Typography } from "@mui/material";
import {
  DeficiencyAdditionalInfoContent,
  DeficiencyContentStep1,
  DeficiencyContentStep2,
  DeficiencyContentStep3,
  DeficiencyInfoContent,
} from "./content/deficiency-content";

import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import { ScrollContainer } from "../elements/scroll-container";
import { useDeficiencyContext } from "../providers/deficiency-provider";
import { CreateDeficiencyPage } from "./create-deficiency-page";
import { useTheme } from "@emotion/react";
import colors from "../theme/colors";
import { Grid } from "@mui/material";

export function DeficiencyPage() {
  const { deficiencyContext } = useDeficiencyContext();
  const { activeStep } = deficiencyContext;
  const theme = useTheme();

  return activeStep < 0 ? (
    <ScrollContainer>
      <Typography variant="h2" noWrap marginLeft={2} marginBottom={5} marginTop={5} fontWeight={600} fontSize={24}>
        {" "}
        Mängelmelder{" "}
      </Typography>
      <InfoWidget
        title="Mängel anlegen"
        icon={
          <InfoIcon
            style={{ marginRight: 0, color: theme.palette.mode === "light" ? "#ffffff" : colors.backgroundDark }}
          />
        }
      >
        <DeficiencyInfoContent />
      </InfoWidget>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xl={4} lg={6} md={12} sm={12} sx={{ display: "flex" }}>
          <InfoWidget title="">
            <DeficiencyContentStep1 />
          </InfoWidget>
        </Grid>
        <Grid item xl={4} lg={6} md={12} sm={12} sx={{ display: "flex" }}>
          <InfoWidget title="">
            <DeficiencyContentStep2 />
          </InfoWidget>
        </Grid>
        <Grid item xl={4} lg={6} md={12} sm={12} sx={{ display: "flex" }}>
          <InfoWidget title="">
            <DeficiencyContentStep3 />
          </InfoWidget>
        </Grid>
      </Grid>

      <InfoWidget
        title="Was passiert nach dem Anlegen der Meldungen?"
        icon={
          <HelpIcon
            style={{ marginRight: 0, color: theme.palette.mode === "light" ? "#ffffff" : colors.backgroundDark }}
          />
        }
      >
        <DeficiencyAdditionalInfoContent />
      </InfoWidget>
    </ScrollContainer>
  ) : (
    <CreateDeficiencyPage />
  );
}
