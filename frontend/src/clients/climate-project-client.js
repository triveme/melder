import { useQuery } from "react-query";

import { client } from "../clients/client";

export async function getClimateProjects(token, filter) {
  const modifiedFilter = new URLSearchParams(filter);

  if (modifiedFilter && modifiedFilter.has("schutz")) {
    const filterCategory = modifiedFilter.getAll("schutz");
    modifiedFilter.delete("schutz");
    filterCategory.forEach((element) => {
      modifiedFilter.append("category", element);
    });
  }
  if (modifiedFilter && modifiedFilter.has("anpassung")) {
    const filterCategory = modifiedFilter.getAll("anpassung");
    modifiedFilter.delete("anpassung");
    filterCategory.forEach((element) => {
      modifiedFilter.append("category", element);
    });
  }
  if (modifiedFilter && modifiedFilter.has("zeithorizont")) {
    const filterZeithorizont = modifiedFilter.getAll("zeithorizont");
    modifiedFilter.delete("zeithorizont");
    filterZeithorizont.forEach((element) => {
      modifiedFilter.append("timeHorizon", element);
    });
  }

  return client
    .get("/climate-projects", {
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

export function useClimateProjects(token, queryTrigger, filterParams) {
  const queryResult = useQuery({
    queryKey: ["climate-projects", token, queryTrigger, filterParams?.toString()],
    queryFn: () => getClimateProjects(token ? token : null, filterParams),
    keepPreviousData: true,
    // Ensure requests are only sent after the filter is set
    enabled: filterParams?.toString().length > 0,
  });

  return { ...queryResult, climateProjects: queryResult.data };
}

export function createClimateProject(token, climateProjectData) {
  if (!token || !climateProjectData) {
    console.log("Can't update climate project, missing parameter(s).");
    return;
  }

  return client.post("/climate-projects", climateProjectData, {
    headers: {
      "x-access-token": token,
    },
  });
}

export function updateClimateProject(token, climateProjectId, climateProjectData) {
  if (!token || !climateProjectId || !climateProjectData) {
    console.log("Can't update climate project, missing parameter(s).");
    return;
  }

  return client.put("/climate-projects/" + climateProjectId, climateProjectData, {
    headers: {
      "x-access-token": token,
    },
  });
}

export function deleteClimateProject(token, climateProjectId) {
  if (!token || !climateProjectId) {
    console.log("Can't delete climate project, missing parameter(s).");
    return;
  }

  return client.delete("/climate-projects/" + climateProjectId, {
    headers: {
      "x-access-token": token,
    },
  });
}
