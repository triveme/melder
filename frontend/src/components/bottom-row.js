import { useState } from "react";
import { useEffect } from "react";

import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";

import { CATEGORIES } from "../constants";
import { TIME_FRAMES } from "../constants";
import { Icon } from "./icon";
import { useStateContext } from "../providers/state-provider";
import { useQuery } from "../providers/query-params-provider";
import { FilterGroup } from "./filter-group";

export function BottomRow({ handleNext }) {
  let query = useQuery();
  const [reportCardOpen, setReportCardOpen] = useState(query.get("report") ? true : false);

  const { stateContext } = useStateContext();

  useEffect(() => {
    if (query.get("report")) {
      // clear query if id doesn't exist
      setReportCardOpen(true);
    } else {
      setReportCardOpen(false);
    }
    // eslint-disable-next-line
  }, [query.get("report")]);

  return (
    /** Filter Chips  -------------------------------------------------------------------------------- */
    <Stack direction="column" spacing={0} alignItems="center">
      {/* Filter Chips nebeneinander */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pt: 1 }}>
        <FilterGroup reportCardOpen={reportCardOpen} filterContent={CATEGORIES} />
        <FilterGroup reportCardOpen={reportCardOpen} filterContent={TIME_FRAMES} />
        {/* Add Button ---------------------------------------------------------------------- */}
        {stateContext.authToken ? (
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
