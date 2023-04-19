import { useMediaQuery } from "@mui/material";
import { FilterChip } from "../elements/filter-chip";
import { Stack } from "@mui/material";
import { Grow } from "@mui/material";
import { Chip } from "@mui/material";
import { Typography } from "@mui/material";
import { Icon } from "./icon";
import { useState } from "react";

export function FilterGroup({ reportCardOpen, filterContent }) {
  const wideEnough = useMediaQuery("(min-width:1100px)");
  const wideEnoughWithCard = useMediaQuery("(min-width:1500px)");
  let filterCategory = "";
  const [filterOpen, setFilterOpen] = useState(false);

  let row = (wideEnough && !reportCardOpen) || (wideEnoughWithCard && reportCardOpen) ? true : false;

  const handleClick = () => {
    setFilterOpen(!filterOpen);
  };

  if (filterContent.length > 0) {
    filterCategory = filterContent[0].filterCategoryName;
  }

  return row ? (
    /* Filterchips nebeneinander */

    <Stack direction={"row"} spacing={0.5} alignItems={"center"} justifyContent={"center"} sx={{ pt: 1 }}>
      {filterContent.map((cat) => (
        <FilterChip key={cat.name} category={cat} />
      ))}
    </Stack>
  ) : (
    <Stack
      direction="column-reverse"
      spacing={1}
      alignItems="flex-start"
      justifyContent="flex-start"
      sx={{ position: "relative" }}
    >
      <Grow in={true}>
        <Chip
          onClick={handleClick}
          aria-label="Meldungen filtern"
          // onDelete={categories && categories.includes(category.name) ? handleClick : null}
          label={
            <Typography
              variant="body2"
              component="div"
              sx={{ display: "flex", alignItems: "center", fontSize: "12px", ml: 0.5 }}
            >
              {filterCategory}
              <Icon
                icon={filterOpen ? "arrowDown" : "arrowUp"}
                props={{
                  fontSize: "small",
                  sx: {
                    ml: 0.5,
                  },
                }}
              />
            </Typography>
          }
          color="default"
          sx={{
            pointerEvents: "all",
          }}
        />
      </Grow>
      {filterOpen ? (
        <Stack
          direction={"column"}
          spacing={0.5}
          alignItems={"start"}
          justifyContent={"flex-start"}
          sx={{ pt: 1, pb: 5, position: "absolute" }}
        >
          {filterContent.map((cat) => (
            <FilterChip key={cat.name} category={cat} />
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
