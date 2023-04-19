import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";

import { reporter } from "../../config/reporter";
import { MarkerPin } from "../../elements/marker-pin";

export function ThankYouStep({ onPostFinished }) {
  return (
    <Box
      square
      sx={{
        pt: 3,
        pl: 3,
        pr: 3,
        pb: 1,
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        {reporter.finalStep.thanks}
      </Typography>
      <Box display="flex" justifyContent="center">
        <MarkerPin report={{ status: "hidden" }} onClick={null} />
      </Box>
      <Button onClick={onPostFinished} sx={{ mt: 1, mr: 1 }}>
        <Typography variant="button" component="div">
          {reporter.close}
        </Typography>
      </Button>
    </Box>
  );
}
