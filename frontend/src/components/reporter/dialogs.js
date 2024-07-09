import { useState } from "react";

import Button from "@mui/material/Button";
import { LoadingAndCancelButtons } from "../../elements/loading-button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Typography from "@mui/material/Typography";

import { useStateContext } from "../../providers/state-provider";

import { deleteReport } from "../../clients/report-client";
import { deleteClimateProject } from "../../clients/climate-project-client";

export function DeleteDialog({ element, category }) {
  if (!element || !category) {
    throw new Error("Element or category is undefined");
  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { stateContext, setStateContext } = useStateContext();

  const handleQueryComplete = () => {
    handleClose();
    setStateContext({
      ...stateContext,
      queryTrigger: stateContext.queryTrigger + 1,
    });
  };

  const handleAdminDeleteClick = () => {
    if (category === "climate") {
      return deleteClimateProject(stateContext.authToken, element.id);
    }
    return deleteReport(stateContext.authToken, element.id);
  };

  return (
    <>
      <Button
        size="small"
        fullWidth
        variant="outlined"
        color="primary"
        endIcon={<DeleteOutlineOutlinedIcon />}
        onClick={handleClickOpen}
        sx={{ p: 1 }}
      >
        <Typography variant="button" component="div">
          Löschen
        </Typography>
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="element-edit-title">
        <DialogTitle id="element-edit-title">Meldung Löschen</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Soll diese Meldung wirklich permanent gelöscht werden?</Typography>
        </DialogContent>
        <DialogActions>
          <LoadingAndCancelButtons
            queryFun={handleAdminDeleteClick}
            cancelFun={handleClose}
            queryCompleteFun={handleQueryComplete}
            queryText="Löschen"
            cancelText="Abbrechen"
            queryColor="error"
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
