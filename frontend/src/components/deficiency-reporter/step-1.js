import { Typography, Stack, TextField, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

import { StyledAccordion, StyledAccordionLast } from "../../elements/custom-accordion";
import { StyledAccordionDetails } from "../../elements/custom-accordion";
import { StyledAccordionSummary } from "../../elements/custom-accordion";
import { useDeficiencyContext } from "../../providers/deficiency-provider";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { snackActions } from "../../utils/snack-bar-utils";

export function Step1({ step }) {
  const { deficiencyContext, setDeficiencyContext } = useDeficiencyContext();
  const { streetName, streetNumber, zipCode, locationName } = deficiencyContext;

  const [expanded, setExpanded] = useState(false);

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleLocationNameChange = (event) => {
    setDeficiencyContext({
      ...deficiencyContext,
      locationName: event.target.value,
    });
  };

  const handleStreetNameChange = (event) => {
    setDeficiencyContext({
      ...deficiencyContext,
      streetName: event.target.value,
    });
  };

  const handleStreetNumberChange = (event) => {
    setDeficiencyContext({
      ...deficiencyContext,
      streetNumber: event.target.value,
    });
  };

  const handleZipCodeChange = (event) => {
    setDeficiencyContext({
      ...deficiencyContext,
      zipCode: event.target.value,
    });
  };
  const handleSetLocationOnMap = () => {
    setDeficiencyContext({
      ...deficiencyContext,
      positionOverlay: true,
    });
  };

  const handleGetGpsLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeficiencyContext({
            ...deficiencyContext,
            location: { lng: position.coords.longitude, lat: position.coords.latitude },
            positionOverlay: true,
            triggerCenter: !deficiencyContext.triggerCenter,
          });
        },
        () => {
          snackActions.error("Fehler beim Abrufen der Koordinaten");
        },
      );
    } else {
      snackActions.error("Standortabfrage nicht verfügbar");
    }
  };

  return (
    <>
      <Typography sx={{ mb: 1, mt: 1 }}>{step.description}</Typography>
      {step.options.map((option, index) =>
        index < step.options.length - 1 ? (
          <StyledAccordion
            key={`Accordion-${option.title}`}
            expanded={expanded === option.title}
            onChange={handleChangeAccordion(option.title)}
          >
            <StyledAccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography fontWeight={800}>{option.title}</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              {option.title === "Adresseingabe" ? (
                <>
                  {" "}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      id="deficiency-street-textfield"
                      label={option.streetLabel}
                      required
                      size="small"
                      placeholder={option.streetPlaceholder}
                      value={streetName}
                      onChange={handleStreetNameChange}
                      inputProps={{ maxLength: step.descriptionMaxChars }}
                      sx={{ mt: 1, mb: 1, width: "80%" }}
                    />{" "}
                    <TextField
                      id="deficiency-streetnumber-textfield"
                      label={option.streetNumberLabel}
                      required
                      size="small"
                      placeholder={option.streetNumberPlaceholder}
                      value={streetNumber}
                      onChange={handleStreetNumberChange}
                      inputProps={{ maxLength: step.descriptionMaxChars }}
                      sx={{ mt: 1, mb: 1, width: "20%" }}
                    />
                  </Stack>
                  <TextField
                    id="deficiency-zipcode-textfield"
                    label={option.zipLabel}
                    required
                    fullWidth
                    size="small"
                    placeholder={option.zipPlaceholder}
                    value={zipCode}
                    onChange={handleZipCodeChange}
                    inputProps={{ maxLength: step.descriptionMaxChars }}
                    sx={{ mt: 1, mb: 1 }}
                  />
                  <TextField
                    id="deficiency-location-textfield"
                    label={option.locationLabel}
                    required
                    fullWidth
                    size="small"
                    placeholder={option.locationPlaceholder}
                    value={locationName}
                    onChange={handleLocationNameChange}
                    inputProps={{ maxLength: step.descriptionMaxChars }}
                    sx={{ mt: 1, mb: 1 }}
                  />
                </>
              ) : option.title === "Standort über Karte bestimmen" ? (
                <>
                  <Stack direction="row">
                    <Typography>Mit dieser Option können Sie den genauen Standort auf der Karte auswählen.</Typography>
                  </Stack>
                  <Button
                    onClick={handleSetLocationOnMap}
                    sx={{ mt: 2 }}
                    variant="contained"
                    startIcon={<AddLocationAltIcon />}
                    fullWidth
                  >
                    Zur Karte
                  </Button>
                </>
              ) : null}
            </StyledAccordionDetails>
          </StyledAccordion>
        ) : (
          <StyledAccordionLast
            key={`Accordion-${option.title}`}
            expanded={expanded === option.title}
            onChange={handleChangeAccordion(option.title)}
          >
            <StyledAccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography fontWeight={800}>{option.title}</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <>
                <Stack direction="row">
                  <Typography>Hier können Sie Ihren aktuellen Standort ermitteln lassen. </Typography>
                </Stack>
                <Button
                  onClick={handleGetGpsLocation}
                  sx={{ mt: 2 }}
                  variant="contained"
                  startIcon={<GpsFixedIcon />}
                  fullWidth
                >
                  Standort ermitteln
                </Button>
              </>
            </StyledAccordionDetails>
          </StyledAccordionLast>
        ),
      )}
    </>
  );
}
