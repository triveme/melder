import { useState } from "react";
import { useEffect } from "react";

import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";

import { CLIMATE_ADJUSTMENT_CATEGORIES, CLIMATE_PROTECTION_CATEGORIES, TIME_FRAMES_CLIMATE } from "../constants";
import { Icon } from "./icon";
import { useStateContext } from "../providers/state-provider";
import { useQuery } from "../providers/query-params-provider";
import { FilterGroup } from "./filter-group";
import { hasPermission } from "../utils/permission-utils";

export function BottomRowClimate({ handleNext }) {
  const query = useQuery();
  const climateProjectId = query.get("klima-projekt");
  const [climateProjectCardOpen, setClimateProjectCardOpen] = useState(climateProjectId !== null ? true : false);

  const { stateContext } = useStateContext();

  useEffect(() => {
    if (climateProjectId !== null) {
      setClimateProjectCardOpen(true);
    } else {
      setClimateProjectCardOpen(false);
    }
  }, [climateProjectId]);

  return (
    /** Filter Chips  -------------------------------------------------------------------------------- */
    <Stack direction="column" spacing={0} alignItems="center">
      {/* Filter Chips nebeneinander */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pt: 1 }}>
        <FilterGroup
          climateProjectCardOpen={climateProjectCardOpen}
          filterContent={CLIMATE_PROTECTION_CATEGORIES}
          pathname="klima"
        />
        <FilterGroup
          climateProjectCardOpen={climateProjectCardOpen}
          filterContent={CLIMATE_ADJUSTMENT_CATEGORIES}
          pathname="klima"
        />
        <FilterGroup
          climateProjectCardOpen={climateProjectCardOpen}
          filterContent={TIME_FRAMES_CLIMATE}
          pathname="klima"
        />
        {/* Add Button ---------------------------------------------------------------------- */}
        {stateContext.authToken && hasPermission(stateContext.adminPermissions, "klima_perm") ? (
          <Grow in={true}>
            <Fab
              color="primary"
              aria-label="Meldung hinzufügen"
              sx={{
                pointerEvents: "all",
                ml: "12px !important",
                zIndex: 12,
              }}
              onClick={handleNext}
            >
              <Icon icon="add" props={{ fontSize: "medium" }} />
            </Fab>
          </Grow>
        ) : null}
      </Stack>
    </Stack>
  );
}
