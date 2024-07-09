import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";

import { CONSTRUCTION_REPORTER, CLIMATE_REPORTER } from "../../config/reporter";

export function ThankYouStep({ category }) {
  if (!category) {
    throw new Error("category is required");
  }

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
        {category === "contruction" ? CONSTRUCTION_REPORTER.finalStep.thanks : CLIMATE_REPORTER.finalStep.thanks}
      </Typography>
      <Button sx={{ mt: 1, mr: 1 }}>
        <Typography variant="button" component="div">
          {category === "contruction" ? CONSTRUCTION_REPORTER.close : CLIMATE_REPORTER.close}
        </Typography>
      </Button>
    </Box>
  );
}
