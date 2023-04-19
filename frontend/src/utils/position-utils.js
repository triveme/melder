import * as turf from "@turf/turf";
import { boundaries } from "../data/GemarkungenJS";

export const coordinatesInsidePolygon = (coordinates, polygon) => {
  let coordinatesArray;

  if (coordinates.lat && coordinates.lng) {
    coordinatesArray = [coordinates.lng, coordinates.lat];
  }

  if (
    coordinates &&
    coordinatesArray &&
    coordinatesArray.length > 0 &&
    turf.booleanPointInPolygon(turf.point(coordinatesArray), turf.polygon(polygon))
  ) {
    return true;
  } else {
    return false;
  }
};

export const getDistrictNameFromCoordinates = (coordinates) => {
  let found = false;
  let districtName = "";
  if (boundaries.features && boundaries.features.length > 0) {
    boundaries.features.forEach((element) => {
      if (
        !found &&
        element.geometry &&
        element.geometry.coordinates &&
        element.geometry.coordinates.length > 0 &&
        element.properties &&
        element.properties.gemarkungs
      ) {
        if (coordinatesInsidePolygon(coordinates, element.geometry.coordinates)) {
          districtName = element.properties.gemarkungs;
          found = true;
        }
      }
    });
  }

  return districtName;
};
