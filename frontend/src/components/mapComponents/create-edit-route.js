import { Marker } from "react-map-gl";
import { Box } from "@mui/system";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useStateContext } from "../../providers/state-provider";
import colors from "../../theme/colors";

export function CreateEditRouteMarker({ coordinate, index, redirection }) {
  const { stateContext, setStateContext } = useStateContext();

  let color = redirection ? colors.redirection : colors.primary;

  const handleDragEnd = (event, index) => {
    let updatedCoordinates = [...stateContext.reporter.lineCoordinates];
    if (updatedCoordinates.length > index) {
      updatedCoordinates[index] = event.lngLat;
    }
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        lineCoordinates: updatedCoordinates,
      },
    });
  };

  const handleDragEndRedirection = (event, index) => {
    let updatedCoordinates = [...stateContext.reporter.newRedirection];
    if (updatedCoordinates.length > index) {
      updatedCoordinates[index] = event.lngLat;
    }
    setStateContext({
      ...stateContext,
      reporter: {
        ...stateContext.reporter,
        newRedirection: updatedCoordinates,
      },
    });
  };

  const removeMarker = (index) => {
    if (!redirection && stateContext.reporter.lineCoordinates.length > index) {
      let updatedCoordinates = stateContext.reporter.lineCoordinates;
      updatedCoordinates.splice(index, 1);
      setStateContext({
        ...stateContext,
        reporter: {
          ...stateContext.reporter,
          lineCoordinates: updatedCoordinates,
        },
      });
    } else if (redirection && stateContext.reporter.newRedirection.length > index) {
      let updatedCoordinates = stateContext.reporter.newRedirection;
      updatedCoordinates.splice(index, 1);
      setStateContext({
        ...stateContext,
        reporter: {
          ...stateContext.reporter,
          newRedirection: updatedCoordinates,
        },
      });
    }
  };

  return (
    <Marker
      key={`create-edit-marker${index}`}
      longitude={coordinate.lng}
      latitude={coordinate.lat}
      anchor="center"
      draggable
      onClick={(event) => {
        //prevent triggering Click-Event on map
        removeMarker(index);
        event.originalEvent.stopPropagation();
      }}
      onDragEnd={(event) => {
        if (redirection) {
          handleDragEndRedirection(event, index);
        } else {
          handleDragEnd(event, index);
        }
      }}
    >
      {" "}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: 60,
          cursor: "pointer",
          position: "relative",
        }}
      >
        <RadioButtonCheckedIcon sx={{ color: color }} anchor="center" />
      </Box>
    </Marker>
  );
}
