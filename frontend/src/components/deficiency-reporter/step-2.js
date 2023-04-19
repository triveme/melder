import { useState } from "react";
import { Select, MenuItem, Typography, FormControl, Divider, TextField } from "@mui/material";
import { useDeficiencyContext } from "../../providers/deficiency-provider";
import { DeficiencySelectImageArea } from "./deficiency-select-image-area";

export function Step2({ step }) {
  const { deficiencyContext, setDeficiencyContext } = useDeficiencyContext();
  const { category, description } = deficiencyContext;

  const [countySelectOpen, setCountySelectOpen] = useState(false);

  const handleCountySelectOpen = () => {
    setCountySelectOpen(true);
  };

  const handleCountySelectClose = (e) => {
    e.stopPropagation();
    setCountySelectOpen(false);
  };

  const handleCategoryChange = (event) => {
    setDeficiencyContext({
      ...deficiencyContext,
      category: event.target.value,
    });
  };

  const handleDescriptionValueChange = (event) => {
    setDeficiencyContext({
      ...deficiencyContext,
      description: event.target.value,
    });
  };
  return (
    <>
      {" "}
      <Typography sx={{ mb: 1, mt: 1, fontWeight: 600, fontSize: "14px" }}>{step.categoryLabel}</Typography>
      <FormControl fullWidth sx={{ mb: 1 }} onClick={handleCountySelectOpen} required>
        {/* <InputLabel id="deficiency-category-input-label">{step.categoryLabel}</InputLabel> */}
        <Select
          id="deficiency-category-input"
          value={category}
          onChange={handleCategoryChange}
          size="small"
          open={countySelectOpen}
          onClose={handleCountySelectClose}
        >
          {step.categories.others.map((category) => (
            <MenuItem key={"deficiency-category-" + category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Divider sx={{ mb: 2, mt: 2 }} />
      <DeficiencySelectImageArea />
      <Divider sx={{ mb: 2, mt: 2 }} />
      <Typography sx={{ mb: 1, mt: 1, fontWeight: 600, fontSize: "14px" }}>{step.description}</Typography>
      <TextField
        id="report-description-textfield"
        required
        fullWidth
        size="small"
        multiline
        placeholder={step.descriptionPlaceholder}
        maxRows={8}
        minRows={4}
        value={description}
        onChange={handleDescriptionValueChange}
        inputProps={{ maxLength: step.descriptionMaxChars }}
        sx={{ mb: 1 }}
      />
    </>
  );
}
