import { Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Stack } from "@mui/material";

import { checkSizeAndType } from "../../utils/image-utils";
import useSmallWidth from "../../providers/use-small-width";
import { useDeficiencyContext } from "../../providers/deficiency-provider";

const iconStyle = {
  // backgroundColor: "background.paper",
  borderRadius: 2,
  padding: "2px",
  border: 1,
  borderColor: "primary.main",
};

const addImageStyle = {
  display: "flex",
  width: "150px",
  height: "150px",
  border: 1,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 2,
  borderColor: "primary.main",
};

export function DeficiencyImagePreview({ imageCount }) {
  const { deficiencyContext, setDeficiencyContext } = useDeficiencyContext();
  const { images } = deficiencyContext;
  const isSmallWith = useSmallWidth();

  const handleRemoveImage = (index) => {
    if (typeof index !== "undefined" && typeof images !== "undefined" && images.length > index) {
      const updatedImages = images;
      updatedImages.splice(index, 1);
      setDeficiencyContext({
        ...deficiencyContext,
        images: updatedImages,
      });
    }
  };

  const handleAddImage = (event) => {
    let maxSize = 3;
    let filesToAdd = [];

    maxSize -= imageCount;

    if (!event.target.files || !event.target.files.length > 0) return;

    if (event.target.files.length < maxSize) {
      maxSize = event.target.files.length;
    }

    filesToAdd = checkSizeAndType(event.target.files, maxSize);

    if (images) {
      setDeficiencyContext({
        ...deficiencyContext,
        images: [...images, ...filesToAdd],
      });
    } else {
      setDeficiencyContext({
        ...deficiencyContext,
        images: [...filesToAdd],
      });
    }
  };

  const getImage = (index, image) => (
    <Grid
      key={`image-preview-${index}`}
      item
      xs={isSmallWith ? 6 : 12}
      sx={{
        width: "150px",
        height: "175px",
        position: "relative",
        display: "flex",
      }}
    >
      <img
        style={{
          height: "150px",
          borderRadius: 10,
          width: "150px",
          objectFit: "cover",
          position: "absolute",
        }}
        src={URL.createObjectURL(image)}
        alt="hochgeladenes bild"
      />
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          position: "absolute",
          p: "4px",
          width: "150px",
          justifyContent: "end",
        }}
      >
        <IconButton
          onClick={() => {
            handleRemoveImage(index);
          }}
          sx={{ ...iconStyle, borderColor: "error.main" }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      </Stack>
    </Grid>
  );

  return (
    <Grid container spacing={2} mt={0}>
      {/* show newly added images */}
      {images && images.length > 0
        ? images.map((image, index) => {
            return getImage(index, image);
          })
        : null}
      {/* show add image button */}
      {imageCount < 3 && imageCount > 0 ? (
        <Grid item xs={6}>
          <label htmlFor="icon-button-add-file">
            <input
              accept="image/*"
              id="icon-button-add-file"
              type="file"
              onChange={handleAddImage}
              style={{ display: "none" }}
              multiple
            />
            <IconButton sx={addImageStyle} aria-label="bild hochladen" component="span">
              <AddIcon color="primary" />
            </IconButton>
          </label>
        </Grid>
      ) : null}
    </Grid>
  );
}
