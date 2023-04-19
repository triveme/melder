import { useState } from "react";

import Divider from "@mui/material/Divider";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { FullInfoCard } from "./full-info-card";
import { LoadingButton } from "../../elements/loading-button";
import { DeleteDialog } from "../reporter/dialogs";
import { useStateContext } from "../../providers/state-provider";
import { updateReport } from "../../clients/report-client";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTheme } from "@emotion/react";

export function AdminCard({ report, admins, handleChangeLocation, handleTriggerCenterMap }) {
  const { stateContext, setStateContext } = useStateContext();
  const [statusValue, setStatusValue] = useState(report.status);
  const theme = useTheme();

  const [comment, setComment] = useState(report.comment);
  const [adminComment, setAdminComment] = useState(report.adminComment);

  const handleStatusRadioChange = (event) => {
    setStatusValue(event.target.value);
  };

  const handleEditClick = () => {
    if (report.location && report.location.length > 0) {
      handleChangeLocation(report.location[Math.floor(report.location.length / 2)]);
    }
    handleTriggerCenterMap();

    setStateContext({
      ...stateContext,
      reporter: {
        idIfEdit: report.id,
        activeStep: 1,
        categoryValue: report.category,
        countyValue: report.county,
        descriptionValue: report.description,
        startDateValue: new Date(report.startDate),
        endDateValue: new Date(report.endDate),
        userMarkerPosition: report.location,
        locationOption: report.location.length > 1 ? "Strecke" : "Standort",
        lineCoordinates: report.location.length > 1 ? report.location : [],
        newRedirection: report.redirection.length > 1 ? report.redirection : [],
        hasRedirection: report.redirection.length > 1 ? true : false,
        title: report.title,
        link: report.link,
        contactPerson: report.contactPerson,
        constructionCosts: report.constructionCosts,
      },
    });
  };

  const lastChanger =
    report.lastModifiedBy && admins ? admins.filter((admin) => admin.id === report.lastModifiedBy)[0] : null;

  const handleReportStatusChangeSubmit = (event) => {
    event.preventDefault();
    return updateReport(stateContext.authToken, report.id, {
      status: statusValue,
      lastModifiedBy: stateContext.adminId,
      adminComment: adminComment,
    });
  };

  const handleReportCommentChangeSubmit = (event) => {
    event.preventDefault();
    return updateReport(stateContext.authToken, report.id, {
      comment: comment,
    });
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleAdminCommentChange = (event) => {
    setAdminComment(event.target.value);
  };

  return (
    <>
      <FullInfoCard report={report} />

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
            value={statusValue}
            onChange={handleStatusRadioChange}
            sx={{ mt: 1, mb: 1 }}
          >
            <FormControlLabel
              value="active"
              control={<Radio sx={{ pt: 0.2, pb: 0.2 }} size="small" checkedIcon={<CheckCircleOutlineIcon />} />}
              label={<Typography sx={{ fontSize: "14px" }}>Sichtbar</Typography>}
            />
            <FormControlLabel
              value="hidden"
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
              : "Diese Meldung wurde von keinem der existierenden Admins bearbeitet"}
          </Typography>
          <TextField
            label="Statusnachricht (für Admins)"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
            multiline
            maxRows={4}
            size="small"
            value={adminComment}
            onChange={handleAdminCommentChange}
            inputProps={{ maxLength: 400 }}
            id="report-admin-comment"
          />
          <LoadingButton
            style={{ mt: 1, p: 1.188 }}
            type="submit"
            fullWidth
            queryFun={handleReportStatusChangeSubmit}
            queryText="Status speichern"
          />
          <Divider sx={{ mt: 2 }} />
          {/* ----------------------------------------- Kommentar -----------------------------------------  */}
          <FormLabel id="report-comment" sx={{ mt: 2 }}>
            Kommentar:
          </FormLabel>
          <TextField
            label="Kommentar (für User)"
            fullWidth
            sx={{ mt: 1, mb: 1 }}
            multiline
            maxRows={4}
            size="small"
            value={comment}
            onChange={handleCommentChange}
            inputProps={{ maxLength: 400 }}
            id="report-comment"
          />
          <LoadingButton
            style={{ mt: 1, p: 1.188 }}
            type="submit"
            fullWidth
            queryFun={handleReportCommentChangeSubmit}
            queryText="Kommentar speichern"
          />
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
        <DeleteDialog report={report} />
      </Box>
    </>
  );
}
