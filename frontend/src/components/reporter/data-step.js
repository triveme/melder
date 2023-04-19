import { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import { getDistrictNameFromCoordinates } from "../../utils/position-utils";
import redirectionSign from "../../assets/images/RedirectionSign.svg";

import { useStateContext } from "../../providers/state-provider";
import { useReports } from "../../clients/report-client";
import { reporter } from "../../config/reporter";
import useDesktop from "../../providers/use-desktop";
import { SelectImageArea } from "./select-image-area";
import moment from "moment";
import { Checkbox, FormControlLabel, FormGroup, Stack } from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export function DataStep({ removedImages, setRemovedImages, center }) {
  const { stateContext, setStateContext } = useStateContext();
  const {
    categoryValue,
    startDateValue,
    endDateValue,
    descriptionValue,
    countyValue,
    title,
    constructionCosts,
    contactPerson,
    link,
  } = stateContext.reporter;

  const { reports } = useReports(stateContext.authToken, stateContext.queryTrigger);

  const report = reports?.find((r) => r.id === stateContext.reporter.idIfEdit);

  const [categorySelectOpen, setCategorySelectOpen] = useState(false);

  const [countySelectOpen, setCountySelectOpen] = useState(false);

  const matchesDesktop = useDesktop();

  const [checked, setChecked] = useState(stateContext.reporter.hasRedirection);

  const step = reporter.steps[2];

  useEffect(() => {
    let countyNameOfCoord = getDistrictNameFromCoordinates(center);
    if (countyNameOfCoord !== "") {
      setStateContext({
        ...stateContext,
        reporter: {
          ...stateContext.reporter,
          countyValue: countyNameOfCoord,
        },
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleStartDateChange = (newDate) => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        startDateValue: newDate,
      },
    });
  };

  const handleEndDateChange = (newDate) => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        endDateValue: newDate,
      },
    });
  };

  const handleDescriptionValueChange = (event) => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        descriptionValue: event.target.value,
      },
    });
  };

  const handleCategoryChange = (event) => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        categoryValue: event.target.value,
      },
    });
  };

  const handleCountyChange = (event) => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        countyValue: event.target.value,
      },
    });
  };

  const handleTitleChange = (event) => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        title: event.target.value,
      },
    });
  };

  const handleConstructionCostChange = (event) => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        constructionCosts: event.target.value,
      },
    });
  };

  const handleContactPersonChange = (event) => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        contactPerson: event.target.value,
      },
    });
  };

  const handleLinkChange = (event) => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        link: event.target.value,
      },
    });
  };

  const handleCategorySelectOpen = () => {
    setCategorySelectOpen(true);
  };

  const handleCountySelectOpen = () => {
    setCountySelectOpen(true);
  };

  const handleCategorySelectClose = (e) => {
    e.stopPropagation();
    setCategorySelectOpen(false);
  };

  const handleCountySelectClose = (e) => {
    e.stopPropagation();
    setCountySelectOpen(false);
  };

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        hasRedirection: event.target.checked,
      },
    });
  };

  const handleClearRedirection = () => {
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        newRedirection: [],
      },
    });
  };

  return (
    <>
      <TextField
        id="report-title-textfield"
        label={step.title}
        required
        fullWidth
        size="small"
        placeholder={step.titlePlaceholder}
        value={title}
        onChange={handleTitleChange}
        inputProps={{ maxLength: 200 }}
        sx={{ mt: 1, mb: 1 }}
      />
      <FormControl fullWidth sx={{ mt: 1, mb: 1 }} onClick={handleCategorySelectOpen} required>
        <InputLabel id="report-category-input-label">{step.category}</InputLabel>
        <Select
          labelId="report-category-input-label"
          id="report-category-input"
          value={categoryValue}
          label={step.category}
          onChange={handleCategoryChange}
          size="small"
          open={categorySelectOpen}
          onClose={handleCategorySelectClose}
        >
          <MenuItem key={"category-" + step.categories.default} value={step.categories.default}>
            {step.categories.default}
          </MenuItem>
          <Divider />
          {step.categories.others.map((category) => (
            <MenuItem key={"category-" + category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 1, mb: 1 }} onClick={handleCountySelectOpen} required>
        <InputLabel id="report-county-input-label">{step.county}</InputLabel>
        <Select
          labelId="report-county-input-label"
          id="report-county-input"
          value={countyValue}
          label={step.county}
          onChange={handleCountyChange}
          size="small"
          open={countySelectOpen}
          onClose={handleCountySelectClose}
        >
          <MenuItem key={"county-" + step.counties.default} value={step.counties.default}>
            {step.counties.default}
          </MenuItem>
          <Divider />
          {step.counties.others.map((county) => (
            <MenuItem key={"county-" + county} value={county}>
              {county}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id="report-description-textfield"
        label={step.description}
        required
        fullWidth
        size="small"
        multiline
        placeholder={step.descriptionPlaceholder}
        maxRows={4}
        minRows={2}
        value={descriptionValue}
        onChange={handleDescriptionValueChange}
        inputProps={{ maxLength: step.descriptionMaxChars }}
        sx={{ mt: 1, mb: 1 }}
      />
      {matchesDesktop ? (
        <>
          <DesktopDatePicker
            required
            label={reporter.steps[2].startDate}
            inputFormat="DD/MM/YYYY"
            value={startDateValue}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField size="small" fullWidth sx={{ mt: 1, mb: 1 }} {...params} />}
            maxDate={endDateValue ? moment(new Date(endDateValue).toUTCString()) : null}
          />
          <DesktopDatePicker
            required
            label={reporter.steps[2].endDate}
            inputFormat="DD/MM/YYYY"
            value={endDateValue}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField size="small" fullWidth sx={{ mt: 1, mb: 1 }} {...params} />}
            minDate={startDateValue ? moment(new Date(startDateValue).toUTCString()) : null}
          />
        </>
      ) : (
        <>
          <MobileDatePicker
            required
            label={reporter.steps[2].startDate}
            inputFormat="DD/MM/YYYY"
            value={startDateValue}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField size="small" fullWidth sx={{ mt: 1, mb: 1 }} {...params} />}
            maxDate={endDateValue ? endDateValue : null}
          />
          <MobileDatePicker
            required
            label={reporter.steps[2].endDate}
            inputFormat="DD/MM/YYYY"
            value={endDateValue}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField size="small" fullWidth sx={{ mt: 1, mb: 1 }} {...params} />}
            minDate={startDateValue ? startDateValue : null}
          />
        </>
      )}
      <TextField
        id="report-constructionCost-textfield"
        label={step.constructionCosts}
        fullWidth
        size="small"
        placeholder={step.constructionCosts}
        value={constructionCosts}
        onChange={handleConstructionCostChange}
        inputProps={{ maxLength: 30 }}
        sx={{ mt: 1, mb: 1 }}
      />
      <TextField
        id="report-contactPerson-textfield"
        label={step.contactPerson}
        fullWidth
        size="small"
        placeholder={step.contactPerson}
        value={contactPerson}
        onChange={handleContactPersonChange}
        inputProps={{ maxLength: 100 }}
        sx={{ mt: 1, mb: 1 }}
      />
      <TextField
        id="report-link-textfield"
        label={step.link}
        fullWidth
        size="small"
        placeholder={step.link}
        value={link}
        onChange={handleLinkChange}
        inputProps={{ maxLength: 400 }}
        sx={{ mt: 1, mb: 1 }}
      />
      <SelectImageArea report={report} removedImages={removedImages} setRemovedImages={setRemovedImages} />
      {stateContext.reporter.hasRedirection &&
      stateContext.reporter.newRedirection &&
      stateContext.reporter.newRedirection.length > 1 ? (
        <Stack direction="row" spacing={2} sx={{ mb: 1 }} alignItems="center">
          <img src={redirectionSign} alt="redirection-sign" />
          <p>Umleitung</p>
          <IconButton onClick={handleClearRedirection}>
            <DeleteIcon color="primary" />
          </IconButton>
        </Stack>
      ) : (
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleCheckboxChange} />}
            label={reporter.steps[2].redirection}
          />
        </FormGroup>
      )}
    </>
  );
}
