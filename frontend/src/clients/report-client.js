import { useQuery } from "react-query";

import { client } from "../clients/client";

export async function getReports(token, filter) {
  return client
    .get("/reports", {
      params: filter,
      headers: token
        ? {
            "x-access-token": token,
          }
        : null,
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
    });
}

export function useReports(token, queryTrigger, filterParams) {
  const queryResult = useQuery({
    queryKey: ["reports", token, queryTrigger, filterParams],
    queryFn: () => getReports(token ? token : null, filterParams),
  });

  return { ...queryResult, reports: queryResult.data };
}

export function createReport(token, reportData) {
  if (!token || !reportData) {
    console.log("Can't update report, missing parameter(s).");
    return;
  }

  return client.post("/reports", reportData, {
    headers: {
      "x-access-token": token,
    },
  });
}

export function updateReport(token, reportId, reportData) {
  if (!token || !reportId || !reportData) {
    console.log("Can't update report, missing parameter(s).");
    return;
  }

  return client.put("/reports/" + reportId, reportData, {
    headers: {
      "x-access-token": token,
    },
  });
}

export function deleteReport(token, reportId) {
  if (!token || !reportId) {
    console.log("Can't delete report, missing parameter(s).");
    return;
  }

  return client.delete("/reports/" + reportId, {
    headers: {
      "x-access-token": token,
    },
  });
}
