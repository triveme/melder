export function getGeoJSON(coordinates) {
  let coordArray = getCoordArray(coordinates);
  const geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: coordArray,
    },
  };

  return geojson;
}

function getCoordArray(coordinates) {
  let coordArray = [];
  coordinates.forEach((element) => {
    coordArray.push([element.lng, element.lat]);
  });
  return coordArray;
}
