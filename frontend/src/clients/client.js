import axios from "axios";

export const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000 * 60 * 5, // 5 minutes
});

export const mapboxClient = axios.create({
  baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places",
  //baseURL: process.env.MAPBOX_GEOCODER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000 * 60 * 5, // 5 minutes
});
