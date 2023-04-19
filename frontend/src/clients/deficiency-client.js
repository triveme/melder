import { client } from "../clients/client";

export function createDeficiency(reportData) {
  if (!reportData) {
    console.log("Can't send deficiency, missing parameter(s).");
    return;
  }

  return client.post("/defects", reportData, {});
}
