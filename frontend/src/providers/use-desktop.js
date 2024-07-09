import { useMediaQuery } from "@mui/material";
/* -------------------------------------------------------------------------- */

const useDesktop = () => {
  return useMediaQuery("(min-width:1100px)");
};

export default useDesktop;
