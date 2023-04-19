import { Button } from "@mui/material";
import { Typography } from "@mui/material";

import { deficiencyReporter } from "../../config/deficiency-reporter";
import { checkSizeAndType } from "../../utils/image-utils";
import { useDeficiencyContext } from "../../providers/deficiency-provider";
import { DeficiencyImagePreview } from "./deficiency-image-preview";

export function DeficiencySelectImageArea() {
  const { deficiencyContext, setDeficiencyContext } = useDeficiencyContext();
  const { images } = deficiencyContext;

  const handleAddImages = (event) => {
    if (!event.target.files || !event.target.files.length > 0) return;

    let filesToAdd = [];
    const maxSize = event.target.files.length > 3 ? 3 : event.target.files.length;
    filesToAdd = checkSizeAndType(event.target.files, maxSize);

    setDeficiencyContext({
      ...deficiencyContext,
      images: filesToAdd,
    });
  };

  return (
    <>
      <Typography sx={{ mb: 1, mt: 1, fontWeight: 600, fontSize: "14px" }}>
        {images.length < 1 ? deficiencyReporter.steps[1].pictureUpload : deficiencyReporter.steps[1].pictureChange}
      </Typography>
      {images.length > 0 ? null : (
        <label htmlFor="icon-button-file">
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            onChange={handleAddImages}
            style={{ display: "none" }}
            multiple
          />
          <Button
            sx={{ textTransform: "none", fontWeight: 600, p: 0.75 }}
            variant="outlined"
            size="small"
            component="span"
            fullWidth
          >
            {deficiencyReporter.steps[1].pictureButtonText}
          </Button>
        </label>
      )}
      <DeficiencyImagePreview imageCount={images.length} />
    </>
  );
}
