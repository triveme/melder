import { useState } from "react";
import { useEffect } from "react";

import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";

import { CONSTRUCTION_CATEGORIES } from "../constants";
import { TIME_FRAMES } from "../constants";
import { Icon } from "./icon";
import { useStateContext } from "../providers/state-provider";
import { useQuery } from "../providers/query-params-provider";
import { FilterGroup } from "./filter-group";
import { hasPermission } from "../utils/permission-utils";

export function BottomRow({ handleNext }) {
  const query = useQuery();
  const reportId = query.get("report");
  const [reportCardOpen, setReportCardOpen] = useState(reportId !== null ? true : false);

  const { stateContext } = useStateContext();

  useEffect(() => {
    if (reportId !== null) {
      setReportCardOpen(true);
    } else {
      setReportCardOpen(false);
    }
  }, [reportId]);

  return (
    /** Filter Chips  -------------------------------------------------------------------------------- */
    <Stack direction="column" spacing={0} alignItems="center">
      {/* Filter Chips nebeneinander */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pt: 1 }}>
        <FilterGroup reportCardOpen={reportCardOpen} filterContent={CONSTRUCTION_CATEGORIES} pathname="melder" />
        <FilterGroup reportCardOpen={reportCardOpen} filterContent={TIME_FRAMES} pathname="melder" />
        {/* Add Button ---------------------------------------------------------------------- */}
        {stateContext.authToken && hasPermission(stateContext.adminPermissions, "melder_perm") ? (
          <Grow in={true}>
            <Fab
              color="primary"
              aria-label="Meldung hinzufügen"
              sx={{
                pointerEvents: "all",
                ml: "12px !important",
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
