import { useQuery } from "react-query";

import { client } from "../clients/client";

async function getDeficiencies(token, offset) {
  if (token === null || offset === undefined) return;

  return client
    .get("/defects", {
      headers: token
        ? {
            "x-access-token": token,
          }
        : null,
      params: {
        offset: offset,
      },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
    });
}

export function useDeficiencies(token, queryTrigger, adminPermissions, offset) {
  const queryResult = useQuery({
    queryKey: ["deficiencies", token, queryTrigger, offset],
    queryFn: () => getDeficiencies(token ? token : null, offset),
    enabled: token && (!adminPermissions || adminPermissions === "" || adminPermissions.includes("maengel_perm")),
  });

  return { ...queryResult, deficiencies: queryResult.data };
}

export function createDeficiency(reportData) {
  if (!reportData) {
    console.log("Can't send deficiency, missing parameter(s).");
    return;
  }
  return client.post("/defects", reportData, {
    headers: {
      "Content-Type": undefined, // This tells Axios to set the correct Content-Type based on the data
    },
  });
}
