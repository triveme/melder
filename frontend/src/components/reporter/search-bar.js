import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useStateContext } from "../../providers/state-provider";
import colors from "../../theme/colors";
import { useTheme } from "@emotion/react";

export function SearchBar() {
  const theme = useTheme();
  const { stateContext, setStateContext } = useStateContext();

  const [name, setName] = useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStateContext({
      ...stateContext,
      address: name,
      triggerAddressSearch: !stateContext.triggerAddressSearch,
    });
  };

  return (
    <Paper
      component="form"
      elevation={4}
      // variant="outlined"
      sx={{
        mt: 2,
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: {xs: 250, sm: 400},
      }}
      style={{ backgroundColor: theme.palette.mode === "light" ? colors.white : colors.paperDark }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Adresssuche"
        inputProps={{ "aria-label": "search google maps" }}
        value={name}
        onChange={handleChange}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search" onClick={handleSubmit}>
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
    </Paper>
  );
}
