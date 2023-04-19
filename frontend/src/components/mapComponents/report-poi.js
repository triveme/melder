import { Marker } from "react-map-gl";
import { MarkerPin } from "../../elements/marker-pin";

export function ReportPOI({ report, selectedReport, handleMarkerClick }) {
  return (
    <Marker key={report.id} longitude={report.location[0].lng} latitude={report.location[0].lat} anchor="bottom">
      <MarkerPin report={report} selectedReport={selectedReport} onClick={() => handleMarkerClick(report)} />
    </Marker>
  );
}
