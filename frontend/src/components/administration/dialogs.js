import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";

import { LoadingAndCancelButtons } from "../../elements/loading-button";

import { useStateContext } from "../../providers/state-provider";

import { createAdmin, updateAdmin, deleteAdmin } from "../../clients/admin-client";

const PERMS = [
  { value: "admin_perm", label: "Nutzerverwaltung" },
  { value: "melder_perm", label: "Hifäller Projekte" },
  { value: "klima_perm", label: "Klimaaktionsplan" },
  { value: "maengel_perm", label: "Mängelmelder" },
  { value: "sensor_perm", label: "Sensordaten" },
];

export function AddDialog() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState("");

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

  const handleAdminCreationClick = () => {
    return createAdmin(stateContext.authToken, {
      username: username,
      password: password,
      permissions: permissions,
    });
  };

  function getPermission(permission) {
    if (permissions === "") return true;
    const permissionsArray = permissions.split(" ");
    return permissionsArray.includes(permission);
  }

  function setPermission(permission) {
    const permissionsArray = permissions ? permissions.split(" ") : [];

    if (permissionsArray.length === 0) {
      PERMS.forEach((perm) => {
        if (perm.value !== permission) permissionsArray.push(perm.value);
      });
    } else if (permissionsArray.includes(permission)) {
      const index = permissionsArray.indexOf(permission);
      permissionsArray.splice(index, 1);
    } else {
      permissionsArray.push(permission);
    }

    if (permissionsArray.length === PERMS.length) setPermissions("");
    else setPermissions(permissionsArray.join(" "));
  }

  return (
    <>
      <Button size="small" endIcon={<PersonAddIcon />} onClick={handleClickOpen}>
        <Typography variant="button" component="div">
          Hinzufügen
        </Typography>
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="admin-edit-title">
        <DialogTitle id="admin-edit-title">Nutzer Hinzufügen</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            size="small"
            required
            fullWidth
            id="username"
            label="Neuer Nutzername"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            size="small"
            required
            fullWidth
            name="password"
            label="Neues Passwort"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormGroup>
            <h3 style={{ marginTop: 5, marginBottom: 0, fontWeight: "normal" }}>Rechte</h3>
            {PERMS.map((perm) => (
              <div key={perm.value}>
                <FormControlLabel
                  control={<Checkbox checked={getPermission(perm.value)} onChange={() => setPermission(perm.value)} />}
                  label={
                    perm.value === "admin_perm" ? <div style={{ fontWeight: "bold" }}>{perm.label}</div> : perm.label
                  }
                />
                {perm.value === "admin_perm" ? <Divider /> : null}
              </div>
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <LoadingAndCancelButtons
            queryFun={handleAdminCreationClick}
            cancelFun={handleClose}
            queryCompleteFun={handleQueryComplete}
            queryText="Speichern"
            cancelText="Abbrechen"
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

export function EditDialog({ admin }) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(admin.username);
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState(admin.permissions || "");

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

  const handleAdminEditClick = () => {
    return updateAdmin(stateContext.authToken, admin.id, {
      username: username,
      password: password,
      permissions: permissions,
    });
  };

  function getPermission(permission) {
    if (permissions === "") return true;
    const permissionsArray = permissions.split(" ");
    return permissionsArray.includes(permission);
  }

  function setPermission(permission) {
    const permissionsArray = permissions ? permissions.split(" ") : [];

    if (permissionsArray.length === 0) {
      PERMS.forEach((perm) => {
        if (perm.value !== permission) permissionsArray.push(perm.value);
      });
    } else if (permissionsArray.includes(permission)) {
      const index = permissionsArray.indexOf(permission);
      permissionsArray.splice(index, 1);
    } else {
      permissionsArray.push(permission);
    }

    if (permissionsArray.length === PERMS.length) setPermissions("");
    else setPermissions(permissionsArray.join(" "));
  }

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        endIcon={<EditIcon />}
        onClick={handleClickOpen}
        sx={{ mt: "8px !important", mr: "8px !important" }}
      >
        {" "}
        <Typography variant="button" component="div">
          Bearbeiten
        </Typography>
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="admin-edit-title">
        <DialogTitle id="admin-edit-title">Nutzer Bearbeiten</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            size="small"
            required
            fullWidth
            id="username"
            label="Neuer Nutzername"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            size="small"
            required
            fullWidth
            name="password"
            label="Neues Passwort"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormGroup>
            <h3 style={{ marginTop: 5, marginBottom: 0, fontWeight: "normal" }}>Rechte</h3>
            {PERMS.map((perm) => (
              <div key={perm.value}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={getPermission(perm.value)}
                      onChange={() => setPermission(perm.value)}
                      disabled={admin.id === 1}
                    />
                  }
                  label={
                    perm.value === "admin_perm" ? <div style={{ fontWeight: "bold" }}>{perm.label}</div> : perm.label
                  }
                />
                {perm.value === "admin_perm" ? <Divider /> : null}
              </div>
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <LoadingAndCancelButtons
            queryFun={handleAdminEditClick}
            cancelFun={handleClose}
            queryCompleteFun={handleQueryComplete}
            queryText="Speichern"
            cancelText="Abbrechen"
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

export function DeleteDialog({ admin }) {
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
    return deleteAdmin(stateContext.authToken, admin.id);
  };

  return (
    <>
      <Button
        disabled={admin.id === 1}
        size="small"
        variant="contained"
        color="error"
        endIcon={<DeleteIcon />}
        onClick={handleClickOpen}
        sx={{ mt: "8px !important", mr: "8px !important" }}
      >
        <Typography variant="button" component="div">
          Löschen
        </Typography>
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="admin-edit-title">
        <DialogTitle id="admin-edit-title">Nutzer Löschen</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Soll der Nutzer{" "}
            <Box component="span" fontWeight="bold">
              {admin.username}
            </Box>{" "}
            wirklich permanent gelöscht werden?
          </Typography>
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
