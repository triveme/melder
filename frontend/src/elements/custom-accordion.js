import { Accordion } from "@mui/material";
import { AccordionSummary } from "@mui/material";
import { AccordionDetails } from "@mui/material";
import styled from "@emotion/styled";

export const StyledAccordion = styled((props) => <Accordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRight: 0,
    borderLeft: 0,
    // "&(:last-of-type)": {
    //   borderBottom: 0,
    // },
    "&:before": {
      display: "none",
    },
  }),
);

export const StyledAccordionLast = styled((props) => <Accordion disableGutters elevation={0} square {...props} />)(
  () => ({
    borderBottom: 0,
    borderRight: 0,
    borderLeft: 0,
    // "&(:last-of-type)": {
    //   borderBottom: 0,
    // },
    "&:before": {
      display: "none",
    },
  }),
);

export const StyledAccordionSummary = styled((props) => <AccordionSummary {...props} />)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0)",
  borderRadius: 0,
  paddingLeft: 0,
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(0),
  },
}));

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  //   borderTop: "1px solid rgba(0, 0, 0, .125)",
  paddingLeft: 0,
}));
