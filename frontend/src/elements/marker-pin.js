import Box from "@mui/material/Box";
import { Icon } from "../components/icon";
import { CATEGORIES } from "../constants";
import markerShadow from "../assets/images/marker/markerShadow.png";
import colors from "../theme/colors";

export function MarkerPin({ report, selectedReport, onClick }) {
  const handleClick = () => {
    if (report.status !== "new") {
      onClick();
    }
  };

  const baseColor =
    report.status === "new"
      ? colors.secondary
      : report.status === "hidden"
      ? colors.primaryDark
      : report.endDate && new Date(report.endDate) < new Date()
      ? colors.green
      : report.startDate && new Date(report.startDate) > new Date()
      ? colors.primary
      : colors.rejected;

  /** 
   * Hacky way to display active/selected pin by drawing another icon behind the other
   * with a different color and slight position adjustments
  */
  let displayIcon = report.id === selectedReport ?(
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
            top: "-8px"
          },
        }}
      />
      <Icon
        icon="pin"
        props={{
          fontSize: "inherit",
          color: baseColor,
          sx: { position: "absolute", color: baseColor},
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
  )

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        justifyContent: "center",
        fontSize: 60,
        cursor: report.status !== "new" && onClick ? "pointer" : "inherit",
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
        {report.status === "new" ? (
          <Icon icon="move" props={{ fontSize: "inherit", sx: { color: colors.white } }} />
        ) : !report.category ? (
          <Icon icon="more" props={{ fontSize: "inherit", sx: { color: colors.white } }} />
        ) : CATEGORIES.some((e) => e.name === report.category) ? (
          <Icon
            icon={CATEGORIES.find((e) => e.name === report.category).icon}
            props={{ fontSize: "inherit", sx: { color: colors.white } }}
          />
        ) : (
          <Icon icon="error" props={{ fontSize: "inherit", sx: { color: colors.white } }} />
        )}
      </Box>
    </Box>
  );
}
