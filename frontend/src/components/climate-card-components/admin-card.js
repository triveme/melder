import { useState } from "react";

import Divider from "@mui/material/Divider";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { FullInfoCard } from "./full-info-card";
import { LoadingButton } from "../../elements/loading-button";
import { DeleteDialog } from "../reporter/dialogs";
import { useStateContext } from "../../providers/state-provider";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTheme } from "@emotion/react";
import { updateClimateProject } from "../../clients/climate-project-client";
import { getDisplayNameAndCategoryFromFilterName } from "../../constants";

export function AdminCard({ climateProject, admins, handleChangeLocation, handleTriggerCenterMap }) {
  const { stateContext, setStateContext } = useStateContext();
  const [isPublicValue, setIsPublicValue] = useState(climateProject.public);
  const theme = useTheme();

  const handleIsPublicRadioChange = (event) => {
    setIsPublicValue(event.target.value);
  };

  const handleEditClick = () => {
    if (climateProject.location && climateProject.location.length > 0) {
      handleChangeLocation(climateProject.location[Math.floor(climateProject.location.length / 2)]);
    }
    handleTriggerCenterMap();

    const { displayName, category } = getDisplayNameAndCategoryFromFilterName(climateProject.category);

    setStateContext({
      ...stateContext,
      climateReporter: {
        idIfEdit: climateProject.id,
        activeStep: 1,
        category: category,
        categoryDisplayName: displayName,
        descriptionValue: climateProject.description,
        timeHorizonValue: climateProject.timeHorizon,
        startDateValue: climateProject.startDate ? new Date(climateProject.startDate) : null,
        endDateValue: climateProject.endDate ? new Date(climateProject.endDate) : null,
        publicValue: climateProject.public,
        userMarkerPosition: climateProject.location ? climateProject.location : null,
        locationTextValue: climateProject.locationText ? climateProject.locationText : "",
        titleValue: climateProject.title,
        costsValue: climateProject.costs ? climateProject.costs : "",
        linkValue: climateProject.link ? climateProject.link : "",
        responsibleValue: climateProject.responsible ? climateProject.responsible : "",
      },
    });
  };

  const lastChanger =
    climateProject.lastModifiedBy && admins
      ? admins.filter((admin) => admin.id === climateProject.lastModifiedBy)[0]
      : null;

  const handleReportStatusChangeSubmit = (event) => {
    event.preventDefault();
    return updateClimateProject(stateContext.authToken, climateProject.id, {
      public: isPublicValue,
      lastModifiedBy: stateContext.adminId,
    });
  };

  return (
    <>
      <FullInfoCard climateProject={climateProject} />
      <Divider />
      <form>
        <FormControl sx={{ p: 1, width: "100%" }} variant="standard">
          {/* -----------------------------------------  Status ------------------------------------------------ */}
          <FormLabel
            focused={false}
            id="report-status-radios"
            sx={{ fontWeight: 600, color: theme.palette.mode === "light" ? "black" : "white", fontSize: 16 }}
          >
            Sichtbarkeit:
          </FormLabel>
          <RadioGroup
            aria-labelledby="report-status-radios"
            name="report-status"
            value={isPublicValue}
            onChange={handleIsPublicRadioChange}
            sx={{ mt: 1, mb: 1 }}
          >
            <FormControlLabel
              value={true}
              control={<Radio sx={{ pt: 0.2, pb: 0.2 }} size="small" checkedIcon={<CheckCircleOutlineIcon />} />}
              label={<Typography sx={{ fontSize: "14px" }}>Sichtbar</Typography>}
            />
            <FormControlLabel
              value={false}
              control={<Radio sx={{ pt: 0.2, pb: 0.2 }} size="small" checkedIcon={<CheckCircleOutlineIcon />} />}
              label={<Typography sx={{ fontSize: "14px" }}>Ausgeblendet</Typography>}
            />
          </RadioGroup>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: "4px !important",
              mb: "4px !important",
              fontSize: "small",
            }}
          >
            {lastChanger
              ? "Zuletzt geändert von: " + lastChanger.username
              : "Diese Meldung wurde von keinem der existierenden Nutzer bearbeitet"}
          </Typography>
          <LoadingButton
            style={{ mt: 1, p: 1.188 }}
            type="submit"
            fullWidth
            queryFun={handleReportStatusChangeSubmit}
            queryText="Status speichern"
          />
          <Divider sx={{ mt: 2 }} />
        </FormControl>
      </form>
      <Divider />
      <Box sx={{ m: 1 }}>
        <Button
          size="small"
          fullWidth
          variant="outlined"
          color="primary"
          endIcon={<EditOutlinedIcon />}
          onClick={handleEditClick}
          sx={{ p: 1 }}
        >
          <Typography variant="button" component="div">
            Bearbeiten
          </Typography>
        </Button>
      </Box>
      <Box sx={{ m: 1 }}>
        <DeleteDialog element={climateProject} category="climate" />
      </Box>
    </>
  );
}
