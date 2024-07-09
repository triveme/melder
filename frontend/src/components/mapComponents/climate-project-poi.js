import { Marker } from "react-map-gl";
import { MarkerPin } from "../../elements/marker-pin";

export function ClimateProjectPoi({ climateProject, handleMarkerClick }) {
  return (
    <Marker
      key={climateProject.id}
      longitude={climateProject.location[0].lng}
      latitude={climateProject.location[0].lat}
      anchor="bottom"
    >
      <MarkerPin element={climateProject} onClick={() => handleMarkerClick(climateProject)} category="climate" />
    </Marker>
  );
}
