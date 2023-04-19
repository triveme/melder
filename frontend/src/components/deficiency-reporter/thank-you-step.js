import { Box } from "@mui/system";
import { Stack, Typography } from "@mui/material";
import { Button } from "@mui/material";

import { deficiencyReporter } from "../../config/deficiency-reporter";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export function DeficiencyThankYouStep({ onPostFinished }) {
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
      <Typography variant="h3" sx={{ mb: 1 }}>
        {deficiencyReporter.finalStep.thanks}
      </Typography>
      <Box display="flex" justifyContent="start" sx={{ mt: 2, mb: 2 }}>
        <Stack direction={"row"} spacing={1} alignItems="center">
          <TaskAltIcon color="primary" fontSize="medium" />
          <Typography variant="body" sx={{ mb: 1 }}>
            {deficiencyReporter.finalStep.deficiencySent}
          </Typography>
        </Stack>
      </Box>

      <Button onClick={onPostFinished} sx={{ mt: 1, mr: 1 }}>
        <Typography variant="button" component="div">
          {deficiencyReporter.close}
        </Typography>
      </Button>
    </Box>
  );
}
