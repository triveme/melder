import { useState } from "react";

import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, IconButton, Stack } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";

import useDesktop from "../../providers/use-desktop";
import { useStateContext } from "../../providers/state-provider";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import colors from "../../theme/colors";

export function FullInfoCard({ report }) {
  const matchesDesktop = useDesktop();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [openedImageIndex, setOpenedImageIndex] = useState(0);
  const { stateContext } = useStateContext();

  const handleImageDialogOpen = (index) => {
    setOpenedImageIndex(index);
    setImageDialogOpen(true);
  };

  const handleImageDialogClose = () => setImageDialogOpen(false);

  const reportStartDate = report.startDate ? new Date(report.startDate) : null;
  const reportStartDateString = reportStartDate ? reportStartDate.toLocaleDateString("de-DE") : null;

  const reportEndDate = report.endDate ? new Date(report.endDate) : null;
  const reportEndDateString = reportEndDate ? reportEndDate.toLocaleDateString("de-DE") : null;

  return (
    <>
      <CardHeader
        title={report.title}
        titleTypographyProps={{ fontWeight: 600 }}
        subheader={`${reportStartDateString} - ${reportEndDateString}`}
        subheaderTypographyProps={{ fontSize: 16, pt: 0.5 }}
        sx={{ p: 0, pb: 2 }}
      />
      <Typography sx={{ fontSize: 16 }}>
        {" "}
        <strong>Stadtteil: </strong> {report.county}
      </Typography>
      <Typography sx={{ fontSize: 16 }}>
        {" "}
        <strong>Kategorie: </strong> {report.category}
      </Typography>
      {report.constructionCosts ? (
        <Typography sx={{ fontSize: 16 }}>
          {" "}
          <strong>Baukosten: </strong> {report.constructionCosts}
        </Typography>
      ) : null}
      {report.contactPerson ? (
        <Typography sx={{ fontSize: 16 }}>
          {" "}
          <strong>Ansprechpartner: </strong> {report.contactPerson}
        </Typography>
      ) : null}
      {report.link ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <Link
            to={{ pathname: report.link }}
            target="_blank"
            style={{
              fontSize: 16,
              textDecoration: "none",
              color: colors.primary,
              fontWeight: 600,
            }}
          >
            Verlinkung
          </Link>
          <IconButton
            color="primary"
            onClick={() => {
              window.open(report.link);
            }}
          >
            <OpenInNewIcon />
          </IconButton>
        </Stack>
      ) : null}
      {report.imgPath && report.imgPath.length > 0
        ? report.imgPath.map((path, index) => {
            return (
              <Box sx={{ pt: 1 }} display="flex" justifyContent="center" key={`Meldungsbild${index}`}>
                <CardMedia
                  component="img"
                  sx={{
                    width: "auto",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                  image={process.env.REACT_APP_BASE_URL + path}
                  alt={report.id + "-meldungsbild"}
                  onClick={() => {
                    handleImageDialogOpen(index);
                  }}
                />
              </Box>
            );
          })
        : null}
      <CardContent sx={{ p: 0, mt: 1, pt: 2 }}>
        <Typography
          variant="body2"
          // color="text.secondary"
          sx={{ mt: "5px !important", mb: "8px !important", fontSize: 16 }}
          style={{ whiteSpace: "pre-line" }}
        >
          <strong>Beschreibung:</strong> <br />
          {report.description}
        </Typography>
        {/* {report.id % 3 === 0 ? (
            <Alert severity="success">Das Problem wurde behoben</Alert>
          ) : report.id % 3 === 1 ? (
            <Alert severity="warning">
              Das Problem ist bekannt und wird schnellstmöglich bearbeitet
            </Alert>
          ) : report.id % 3 === 2 ? (
            <Alert severity="info">Das Problem wird behoben</Alert>
          ) : null} */}
      </CardContent>
      {report.imgPath && report.imgPath.length > 0 && report.imgPath.length > openedImageIndex ? (
        <Dialog
          fullScreen={matchesDesktop === false}
          maxWidth="xl"
          open={imageDialogOpen}
          onClose={handleImageDialogClose}
        >
          <DialogContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={process.env.REACT_APP_BASE_URL + report.imgPath[openedImageIndex]}
              alt={report.id + "-meldungsbild-groß"}
            />
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handleImageDialogClose}>Schliessen</Button>
          </DialogActions>
        </Dialog>
      ) : null}
      {!stateContext.authToken && report.comment ? (
        <Card sx={{ mt: 5 }}>
          <CardHeader subheader="Kommentar" />
          <CardContent sx={{ p: 0, m: 2, mt: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: "0px !important", mb: "8px !important", fontStyle: "italic" }}
            >
              {report.comment}
            </Typography>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
