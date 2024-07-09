import { Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import { useStateContext } from "../../providers/state-provider";
import { CONSTRUCTION_REPORTER, CLIMATE_REPORTER } from "../../config/reporter";
import { ImagePreview, resizeFile } from "./image-preview";

export function SelectImageArea({ element, removedImages, setRemovedImages, type }) {
  if (!type) {
    throw new Error("SelectImageArea: type is undefined");
  }

  const { stateContext, setStateContext } = useStateContext();
  const { images } = type === "construction" ? stateContext.reporter : stateContext.climateReporter;
  const step = type === "construction" ? CONSTRUCTION_REPORTER.steps[2] : CLIMATE_REPORTER.steps[2];
  let imageCount = 0;

  if (images && images.length > 0) {
    imageCount += images.length;
  }

  if (type === "construction") {
    if (stateContext.reporter.idIfEdit && element && element.imgPath && element.imgPath.length > 0) {
      imageCount += element.imgPath.length;
    }
  } else if (type === "climate") {
    if (stateContext.climateReporter.idIfEdit && element && element.imgPath && element.imgPath.length > 0) {
      imageCount += element.imgPath.length;
    }
  }

  if (removedImages.length > 0) {
    imageCount -= removedImages.length;
  }

  const handleAddImages = async (event) => {
    if (!event.target.files || !event.target.files.length > 0) return;

    let filesToAdd = [];

    try {
      filesToAdd = await Promise.all([...event.target.files].map((file) => resizeFile(file)));
    } catch (error) {
      console.error(error);
    }

    if (type === "construction") {
      setStateContext({
        ...stateContext,
        reporter: {
          ...stateContext.reporter,
          images: filesToAdd,
        },
      });
    } else if (type === "climate") {
      setStateContext({
        ...stateContext,
        climateReporter: {
          ...stateContext.climateReporter,
          images: filesToAdd,
        },
      });
    }
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" sx={{ minHeight: "30px", display: "flex", alignItems: "center" }}>
          {imageCount > 0 ? step.pictureChange : step.pictureUpload}
        </Typography>
        {imageCount > 0 ? null : (
          <label htmlFor="icon-button-file">
            <input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={handleAddImages}
              style={{ display: "none" }}
              multiple
            />
            <IconButton color="primary" aria-label="bild hochladen" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        )}
      </Stack>
      <ImagePreview
        element={element}
        type={type}
        edit={
          element &&
          ((type === "construction" && stateContext.reporter.idIfEdit) ||
            (type === "climate" && stateContext.climateReporter.idIfEdit))
        }
        imageCount={imageCount}
        removedImages={removedImages}
        setRemovedImages={setRemovedImages}
      />
    </>
  );
}
