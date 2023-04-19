import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grow from "@mui/material/Grow";

import { Icon } from "../components/icon";
import { useStateContext } from "../providers/state-provider";
import { useQuery } from "../providers/query-params-provider";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

export function FilterChip({ category }) {
  const { stateContext, setStateContext } = useStateContext();
  const history = useHistory();
  const [visible, setVisible] = useState(true);
  let query = useQuery();
  let filterActive = false;

  if (query.get(category.filterCategory) === category.filterName) {
    filterActive = true;
  }

  useEffect(() => {
    // if filter is active: only show filtered chips
    let queryString = query.get(category.filterCategory);
    if (queryString) {
      if (queryString === category.filterName) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    } else {
      setVisible(true);
    }
    // eslint-disable-next-line
  }, [query.get(category.filterCategory)]);

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
    let filterQuery = query.get(category.filterCategory);

    let params = {};

    for (var entry of query.entries()) {
      params[entry[0]] = entry[1];
    }

    if (filterQuery && filterQuery === category.filterName) {
      //remove filter
      delete params[category.filterCategory];

      const queryString = Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");

      history.push({
        search: queryString === "" ? "" : `?${queryString}`,
      });
      filterActive = false;
    } else {
      //add filter
      params[category.filterCategory] = category.filterName;
      const queryString = Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");

      history.push({
        pathname: "melder",
        search: `?${queryString}`,
      });
      filterActive = true;
    }

    setStateContext({
      ...stateContext,
      filter: params,
    });
  };

  return visible ? (
    <Grow in={visible}>
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
        color={filterActive ? "primary" : "default"}
        sx={{
          pointerEvents: "all",
        }}
      />
    </Grow>
  ) : null;
}
