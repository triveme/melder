import { Marker } from "react-map-gl";
import { Box } from "@mui/system";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useStateContext } from "../../providers/state-provider";
import colors from "../../theme/colors";

export function CreateEditClimateRouteMarker({ coordinate, index, redirection }) {
  const { stateContext, setStateContext } = useStateContext();

  let color = redirection ? colors.redirection : colors.primary;

  const handleDragEnd = (event, index) => {
    let updatedCoordinates = [...stateContext.climateReporter.lineCoordinates];
    if (updatedCoordinates.length > index) {
      updatedCoordinates[index] = event.lngLat;
    }
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        lineCoordinates: updatedCoordinates,
      },
    });
  };

  const handleDragEndRedirection = (event, index) => {
    let updatedCoordinates = [...stateContext.climateReporter.newRedirection];
    if (updatedCoordinates.length > index) {
      updatedCoordinates[index] = event.lngLat;
    }
    setStateContext({
      ...stateContext,
      climateReporter: {
        ...stateContext.climateReporter,
        newRedirection: updatedCoordinates,
      },
    });
  };

  const removeMarker = (index) => {
    if (!redirection && stateContext.climateReporter.lineCoordinates.length > index) {
      let updatedCoordinates = stateContext.climateReporter.lineCoordinates;
      updatedCoordinates.splice(index, 1);
      setStateContext({
        ...stateContext,
        climateReporter: {
          ...stateContext.climateReporter,
          lineCoordinates: updatedCoordinates,
        },
      });
    } else if (redirection && stateContext.climateReporter.newRedirection.length > index) {
      let updatedCoordinates = stateContext.climateReporter.newRedirection;
      updatedCoordinates.splice(index, 1);
      setStateContext({
        ...stateContext,
        climateReporter: {
          ...stateContext.climateReporter,
          newRedirection: updatedCoordinates,
        },
      });
    }
  };

  return (
    <Marker
      key={`create-edit-climate-marker${index}`}
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
