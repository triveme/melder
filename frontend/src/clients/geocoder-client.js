import { mapboxClient } from "../clients/client";
import { useQuery } from "react-query";

export async function getCoordinate(address) {
  const addressArray = address.split(" ");
  addressArray.push("hünfeld");
  const addrSearchQuery = addressArray.join("%20");
  return mapboxClient
    .get(`/${addrSearchQuery}.json`, {
      params: { access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN, language: "de-DE" },
    })
    .then((response) => {
      if (
        response.data.features &&
        response.data.features.length > 0 &&
        response.data.features[0].center &&
        response.data.features[0].center.length > 1
      ) {
        // console.log(response.data.features[0].place_name);
        return [response.data.features[0].center[0], response.data.features[0].center[1]];
      } else {
        return [];
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function useGeoCoder(address) {
  const queryResult = useQuery({
    queryKey: ["geocoder", address],
    queryFn: () => getCoordinate(address),
  });

  return { ...queryResult, coordinates: queryResult.data };
}
