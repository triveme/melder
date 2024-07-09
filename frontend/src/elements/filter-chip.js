import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import { Icon } from "../components/icon";
import { useQuery } from "../providers/query-params-provider";
import { useHistory } from "react-router-dom";

export function FilterChip({ category, pathname }) {
  if (!pathname) {
    throw new Error("FilterChip: pathname is required");
  }

  const history = useHistory();
  const query = useQuery();
  let filterActive = false;

  if (query.getAll(category.filterCategory).includes(category.filterName)) {
    filterActive = true;
  }

  let iconSx = {
    mr: 1,
  };

  if (category.color) {
    iconSx = { ...iconSx, color: category.color };
  }

  if (category.categoryColor) {
    iconSx = { ...iconSx, color: category.categoryColor };
  }

  const handleClick = () => {
    const activeFilters = query.getAll(category.filterCategory);
    const searchParams = new URLSearchParams(query);

    if (activeFilters.includes(category.filterName)) {
      const updatedFilters = activeFilters.filter((filter) => filter !== category.filterName);
      searchParams.delete(category.filterCategory);
      updatedFilters.forEach((filter) => searchParams.append(category.filterCategory, filter));
    } else {
      searchParams.append(category.filterCategory, category.filterName);
    }

    history.push({
      pathname: pathname,
      search: searchParams.toString(),
    });
  };

  return (
    <Chip
      onClick={handleClick}
      // onDelete={categories && categories.includes(category.name) ? handleClick : null}
      label={
        <Typography variant="body2" component="div" sx={{ display: "flex", alignItems: "center", fontSize: "12px" }}>
          {category.icon ? (
            <Icon
              icon={category.icon}
              props={{
                fontSize: "small",
                sx: iconSx,
              }}
            />
          ) : null}
          {category.name}
        </Typography>
      }
      sx={
        filterActive
          ? { pointerEvents: "all" }
          : {
              opacity: 0.5,
              pointerEvents: "all",
            }
      }
    />
  );
}
