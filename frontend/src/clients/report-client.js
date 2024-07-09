import { useQuery } from "react-query";

import { client } from "../clients/client";

export async function getReports(token, filter) {
  const modifiedFilter = new URLSearchParams(filter);

  if (modifiedFilter && modifiedFilter.has("kategorie")) {
    const filterKategorie = modifiedFilter.getAll("kategorie");
    modifiedFilter.delete("kategorie");
    filterKategorie.forEach((element) => {
      modifiedFilter.append("category", element.charAt(0).toUpperCase() + element.slice(1));
    });
  }

  return client
    .get("/reports", {
      params: modifiedFilter,
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
    queryKey: ["reports", token, queryTrigger, filterParams?.toString()],
    queryFn: () => getReports(token ? token : null, filterParams),
    keepPreviousData: true,
    // Ensure requests are only sent after the filter is set
    enabled: filterParams?.toString().length > 0,
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
