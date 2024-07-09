import { useState } from "react";

import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import MobileDatePicker from "@mui/lab/MobileDatePicker";

import { useQuery } from "../../providers/query-params-provider";

import { useStateContext } from "../../providers/state-provider";
import { useClimateProjects } from "../../clients/climate-project-client";
import { CLIMATE_REPORTER } from "../../config/reporter";
import useDesktop from "../../providers/use-desktop";
import { SelectImageArea } from "./select-image-area";
import moment from "moment";

export function DataStepClimate({ removedImages, setRemovedImages }) {
  const query = useQuery();
  const { stateContext, setStateContext } = useStateContext();
  const {
    category,
    categoryDisplayName,
    startDateValue,
    endDateValue,
    descriptionValue,
    titleValue,
    costsValue,
    responsibleValue,
    linkValue,
    timeHorizonValue,
  } = stateContext.climateReporter;

  const { climateProjects } = useClimateProjects(stateContext.authToken, stateContext.queryTrigger, query);

  const climateProject = climateProjects?.find((p) => p.id === stateContext.climateReporter.idIfEdit);

  const [categorySelectOpen, setCategorySelectOpen] = useState(false);
  const [subCategorySelectOpen, setSubCategorySelectOpen] = useState(false);
  const [timeHorizonSelectOpen, setTimeHorizonSelectOpen] = useState(false);

  const matchesDesktop = useDesktop();

  const step = CLIMATE_REPORTER.steps[2];

  const handleStartDateChange = (newDate) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        startDateValue: newDate,
      },
    });
  };

  const handleEndDateChange = (newDate) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        endDateValue: newDate,
      },
    });
  };

  const handleDescriptionValueChange = (event) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        descriptionValue: event.target.value,
      },
    });
  };

  const handleCategoryChange = (event) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        category: event.target.value,
        categoryDisplayName: "Allgemeines",
      },
    });
  };

  const handleSubCategoryChange = (event) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        categoryDisplayName: event.target.value,
      },
    });
  };

  const handleTimeHorizonChange = (event) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        timeHorizonValue: event.target.value,
      },
    });
  };

  const handleTitleChange = (event) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        titleValue: event.target.value,
      },
    });
  };

  const handleCostsChange = (event) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        costsValue: event.target.value,
      },
    });
  };

  const handleResponsibleChange = (event) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        responsibleValue: event.target.value,
      },
    });
  };

  const handleLinkChange = (event) => {
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        linkValue: event.target.value,
      },
    });
  };

  const handleCategorySelectOpen = () => {
    setCategorySelectOpen(true);
  };
  const handleCategorySelectClose = (e) => {
    e.stopPropagation();
    setCategorySelectOpen(false);
  };

  const handleSubCategorySelectOpen = () => {
    setSubCategorySelectOpen(true);
  };
  const handleSubCategorySelectClose = (e) => {
    e.stopPropagation();
    setSubCategorySelectOpen(false);
  };
  const handleTimeHorizonSelectOpen = () => {
    setTimeHorizonSelectOpen(true);
  };
  const handleTimeHorizonSelectClose = (e) => {
    e.stopPropagation();
    setTimeHorizonSelectOpen(false);
  };

  return (
    <>
      <TextField
        id="climate-project-title-textfield"
        label={step.title}
        required
        fullWidth
        size="small"
        placeholder={step.titlePlaceholder}
        value={titleValue}
        onChange={handleTitleChange}
        inputProps={{ maxLength: 200 }}
        sx={{ mt: 1, mb: 1 }}
      />
      <FormControl fullWidth sx={{ mt: 1, mb: 1 }} onClick={handleCategorySelectOpen} required>
        <InputLabel id="climate-project-category-input-label">{step.category}</InputLabel>
        <Select
          labelId="climate-project-category-input-label"
          id="climate-project-category-input"
          value={category}
          label={step.category}
          onChange={handleCategoryChange}
          size="small"
          open={categorySelectOpen}
          onClose={handleCategorySelectClose}
        >
          {step.categories.map((category) => (
            <MenuItem key={"category-" + category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 1, mb: 1 }} onClick={handleSubCategorySelectOpen} required>
        <InputLabel id="climate-project-subcategory-input-label">{step.subCategory}</InputLabel>
        <Select
          labelId="climate-project-subcategory-input-label"
          id="climate-project-subcategory-input"
          value={categoryDisplayName}
          label={step.subCategory}
          onChange={handleSubCategoryChange}
          size="small"
          open={subCategorySelectOpen}
          onClose={handleSubCategorySelectClose}
        >
          {step.subCategories[category].map((subCategory) => (
            <MenuItem key={"subcategory-" + subCategory} value={subCategory}>
              {subCategory}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 1, mb: 1 }} onClick={handleTimeHorizonSelectOpen} required>
        <InputLabel id="climate-project-time-horizon-input-label">{step.category}</InputLabel>
        <Select
          labelId="climate-project-time-horizon-input-label"
          id="climate-project-time-horizon-input"
          value={timeHorizonValue ? timeHorizonValue.charAt(0).toUpperCase() + timeHorizonValue.slice(1) : ""}
          label={step.timeHorizon}
          onChange={handleTimeHorizonChange}
          size="small"
          open={timeHorizonSelectOpen}
          onClose={handleTimeHorizonSelectClose}
        >
          {step.timeHorizons.map((horizon) => (
            <MenuItem key={"time-horizon-" + horizon} value={horizon}>
              {horizon}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id="climate-project-description-textfield"
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
            label={CLIMATE_REPORTER.steps[2].startDate}
            inputFormat="DD/MM/YYYY"
            value={startDateValue}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField size="small" fullWidth sx={{ mt: 1, mb: 1 }} {...params} />}
            maxDate={endDateValue ? moment(new Date(endDateValue).toUTCString()) : null}
          />
          <DesktopDatePicker
            label={CLIMATE_REPORTER.steps[2].endDate}
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
            label={CLIMATE_REPORTER.steps[2].startDate}
            inputFormat="DD/MM/YYYY"
            value={startDateValue}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField size="small" fullWidth sx={{ mt: 1, mb: 1 }} {...params} />}
            maxDate={endDateValue ? endDateValue : null}
          />
          <MobileDatePicker
            label={CLIMATE_REPORTER.steps[2].endDate}
            inputFormat="DD/MM/YYYY"
            value={endDateValue}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField size="small" fullWidth sx={{ mt: 1, mb: 1 }} {...params} />}
            minDate={startDateValue ? startDateValue : null}
          />
        </>
      )}
      <TextField
        id="climate-project-costs-textfield"
        label={step.costs}
        fullWidth
        size="small"
        placeholder={step.costs}
        value={costsValue}
        onChange={handleCostsChange}
        inputProps={{ maxLength: 30 }}
        sx={{ mt: 1, mb: 1 }}
      />
      <TextField
        id="climate-project-responsible-textfield"
        label={step.responsible}
        fullWidth
        size="small"
        placeholder={step.responsible}
        value={responsibleValue}
        onChange={handleResponsibleChange}
        inputProps={{ maxLength: 100 }}
        sx={{ mt: 1, mb: 1 }}
      />
      <TextField
        id="climate-project-link-textfield"
        label={step.link}
        fullWidth
        size="small"
        placeholder={step.link}
        value={linkValue}
        onChange={handleLinkChange}
        inputProps={{ maxLength: 400 }}
        sx={{ mt: 1, mb: 1 }}
      />
      <SelectImageArea
        element={climateProject}
        removedImages={removedImages}
        setRemovedImages={setRemovedImages}
        type="climate"
      />
      {/* {stateContext.climateReporter.hasRedirection &&
      stateContext.climateReporter.newRedirection &&
      stateContext.climateReporter.newRedirection.length > 1 ? (
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
            label={CLIMATE_REPORTER.steps[2].redirection}
          />
        </FormGroup>
      )} */}
    </>
  );
}
