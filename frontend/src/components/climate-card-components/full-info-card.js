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

import useDesktop from "../../providers/use-desktop";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import colors from "../../theme/colors";
import { getDisplayNameAndCategoryFromFilterName } from "../../constants";

export function FullInfoCard({ climateProject }) {
  const matchesDesktop = useDesktop();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [openedImageIndex, setOpenedImageIndex] = useState(0);

  const handleImageDialogOpen = (index) => {
    setOpenedImageIndex(index);
    setImageDialogOpen(true);
  };

  const handleImageDialogClose = () => setImageDialogOpen(false);

  const climateProjectStartDate = climateProject.startDate ? new Date(climateProject.startDate) : null;
  const climateProjectStartDateString = climateProjectStartDate
    ? climateProjectStartDate.toLocaleDateString("de-DE")
    : null;

  const climateProjectEndDate = climateProject.endDate ? new Date(climateProject.endDate) : null;
  const climateProjectEndDateString = climateProjectEndDate ? climateProjectEndDate.toLocaleDateString("de-DE") : null;

  const { displayName, category } = getDisplayNameAndCategoryFromFilterName(climateProject.category);

  function getNiceDateSubHeader() {
    if (!climateProjectStartDate && !climateProjectEndDate) {
      return null;
    }

    if (climateProjectStartDate && !climateProjectEndDate) {
      return `Startdatum: ${climateProjectStartDateString}`;
    }

    if (!climateProjectStartDate && climateProjectEndDate) {
      return `Enddatum: ${climateProjectEndDateString}`;
    }

    return `${climateProjectStartDateString} - ${climateProjectEndDateString}`;
  }

  return (
    <>
      <CardHeader
        title={climateProject.title}
        titleTypographyProps={{ fontWeight: 600 }}
        subheader={getNiceDateSubHeader()}
        subheaderTypographyProps={{ fontSize: 16, pt: 0.5 }}
        sx={{ p: 0, pb: 2 }}
      />
      <Typography sx={{ fontSize: 16 }}>
        <strong>Kategorie: </strong> {category}
      </Typography>
      <Typography sx={{ fontSize: 16 }}>
        <strong>Subkategorie: </strong> {displayName}
      </Typography>
      <Typography sx={{ fontSize: 16 }}>
        <strong>Zeithorizont: </strong>{" "}
        {climateProject.timeHorizon.charAt(0).toUpperCase() + climateProject.timeHorizon.slice(1)}
      </Typography>
      {climateProject.costs ? (
        <Typography sx={{ fontSize: 16 }}>
          <strong>Kosten: </strong> {climateProject.costs}
        </Typography>
      ) : null}
      {climateProject.responsible ? (
        <Typography sx={{ fontSize: 16 }}>
          <strong>Zuständiger Fachbereich: </strong> {climateProject.responsible}
        </Typography>
      ) : null}
      {climateProject.link ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <Link
            to={{ pathname: climateProject.link }}
            target="_blank"
            rel="noopener noreferrer"
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
              window.open(climateProject.link);
            }}
          >
            <OpenInNewIcon />
          </IconButton>
        </Stack>
      ) : null}
      {climateProject.imgPath && climateProject.imgPath.length > 0
        ? climateProject.imgPath.map((path, index) => {
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
                  alt={climateProject.id + "-meldungsbild"}
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
          {climateProject.description}
        </Typography>
      </CardContent>
      {climateProject.imgPath &&
      climateProject.imgPath.length > 0 &&
      climateProject.imgPath.length > openedImageIndex ? (
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
              src={process.env.REACT_APP_BASE_URL + climateProject.imgPath[openedImageIndex]}
              alt={climateProject.id + "-meldungsbild-groß"}
            />
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handleImageDialogClose} sx={{ paddingBottom: 1 }}>
              Schliessen
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
}
