import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Stack from "@mui/material/Stack";
// import Alert from "@mui/material/Alert";

// import { snackActions } from "../utils/snack-bar-utils";

import { useStateContext } from "../providers/state-provider";
import { useColorModeContext } from "../providers/theme-provider";

import colors from "../theme/colors";
import { FullInfoCard } from "./report-card-components/full-info-card";
import { AdminCard } from "./report-card-components/admin-card";
import { hasPermission } from "../utils/permission-utils";

export function ReportCard({ report, admins, handleMarkerPopupClose, handleChangeLocation, handleTriggerCenterMap }) {
  const { stateContext } = useStateContext();
  const { colorMode } = useColorModeContext();

  return (
    <Box
      sx={{
        p: 2,
        overflowY: "scroll",
        height: "100%",
      }}
    >
      <Stack
        direction="column"
        spacing={1}
        sx={{
          height: "100%",
          borderRadius: "10px",
          p: "20px",
        }}
      >
        {stateContext.authToken && hasPermission(stateContext.adminPermissions, "melder_perm") ? (
          <AdminCard
            admins={admins}
            handleChangeLocation={handleChangeLocation}
            handleTriggerCenterMap={handleTriggerCenterMap}
            report={report}
          />
        ) : (
          <FullInfoCard report={report} />
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
            alignItems: "flex-end",
          }}
        >
          <Button onClick={handleMarkerPopupClose} color="secondary">
            <Typography variant="button" component="div" color="primary" sx={{ paddingBottom: 1 }}>
              Schliessen
            </Typography>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
