import Box from "@mui/material/Box";
import { Icon } from "../components/icon";
import { CLIMATE_ADJUSTMENT_CATEGORIES, CLIMATE_PROTECTION_CATEGORIES, CONSTRUCTION_CATEGORIES } from "../constants";
import markerShadow from "../assets/images/marker/markerShadow.png";
import colors from "../theme/colors";
import { useQuery } from "../providers/query-params-provider";
import { useLocation } from "react-router-dom";

export function MarkerPin({ element, onClick, category }) {
  if (!category) {
    throw new Error("MarkerPin: category prop is required");
  }

  const location = useLocation();
  const { pathname } = location;
  const query = useQuery();

  const selectedElement = pathname === "/klima" ? query.get("klima-projekt") : query.get("report");

  const handleClick = () => {
    if (element.status !== "new") {
      onClick();
    }
  };

  let baseColor = colors.secondary;

  if (category === "construction") {
    baseColor =
      element.status === "new"
        ? colors.primaryDark
        : element.status === "hidden"
        ? colors.primaryDark
        : element.endDate && new Date(element.endDate) < new Date()
        ? colors.green
        : element.startDate && new Date(element.startDate) > new Date()
        ? colors.primary
        : colors.rejected;
  } else if (category === "climate") {
    baseColor =
      element.public === false || element.status === "new"
        ? colors.primaryDark
        : element.timeHorizon === "kurzfristig"
        ? colors.lightBlue
        : element.timeHorizon === "mittelfristig"
        ? colors.lightBlueDark
        : element.timeHorizon === "langfristig"
        ? colors.primary
        : colors.green;
  }

  /**
   * Hacky way to display active/selected pin by drawing another icon behind the other
   * with a different color and slight position adjustments
   */
  const displayIcon =
    element.id == selectedElement ? (
      <>
        <Icon
          icon="pin"
          props={{
            fontSize: "inherit",
            color: baseColor,
            sx: {
              position: "absolute",
              color: colors.secondary,
              fontSize: "1.3em",
              top: "-8px",
            },
          }}
        />
        <Icon
          icon="pin"
          props={{
            fontSize: "inherit",
            color: baseColor,
            sx: { position: "absolute", color: baseColor },
          }}
        />
      </>
    ) : (
      <Icon
        icon="pin"
        props={{
          fontSize: "inherit",
          color: baseColor,
          sx: { position: "absolute", color: baseColor },
        }}
      />
    );

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        justifyContent: "center",
        fontSize: 60,
        cursor: element.status !== "new" && onClick ? "pointer" : "inherit",
      }}
    >
      <img src={markerShadow} alt="marker shadow" style={{ marginLeft: 16, marginTop: 15 }} />
      {displayIcon}
      <Icon
        icon="circle"
        props={{
          fontSize: "medium",
          sx: {
            position: "absolute",
            color: baseColor,
            mt: 1,
          },
        }}
      />
      <Box sx={{ position: "absolute", mt: "10px", fontSize: 24 }}>
        {element.status === "new" ? (
          <Icon icon="move" props={{ fontSize: "inherit", sx: { color: colors.white } }} />
        ) : !element.category ? (
          <Icon icon="more" props={{ fontSize: "inherit", sx: { color: colors.white } }} />
        ) : category === "construction" ? (
          CONSTRUCTION_CATEGORIES.some((e) => e.name === element.category) ? (
            <Icon
              icon={CONSTRUCTION_CATEGORIES.find((e) => e.name === element.category).icon}
              props={{ fontSize: "inherit", sx: { color: colors.white } }}
            />
          ) : (
            <Icon icon="error" props={{ fontSize: "inherit", sx: { color: colors.white } }} />
          )
        ) : CLIMATE_PROTECTION_CATEGORIES.some((e) => e.filterName === element.category) ? (
          <Icon
            icon={CLIMATE_PROTECTION_CATEGORIES.find((e) => e.filterName === element.category).icon}
            props={{ fontSize: "inherit", sx: { color: colors.white } }}
          />
        ) : CLIMATE_ADJUSTMENT_CATEGORIES.some((e) => e.filterName === element.category) ? (
          <Icon
            icon={CLIMATE_ADJUSTMENT_CATEGORIES.find((e) => e.filterName === element.category).icon}
            props={{ fontSize: "inherit", sx: { color: colors.white } }}
          />
        ) : (
          <Icon icon="error" props={{ fontSize: "inherit", sx: { color: colors.white } }} />
        )}
      </Box>
    </Box>
  );
}
