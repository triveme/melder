import { ToggleButtonGroup } from "@mui/material";
import { ToggleButton } from "@mui/material";
import { Icon } from "../components/icon";
import { useStateContext } from "../providers/state-provider";

export function DualToggleButton({ options, type }) {
  if (!type) {
    throw new Error("DualToggleButton: type is undefined");
  }

  const { stateContext, setStateContext } = useStateContext();
  const { reporter, climateReporter } = stateContext;

  const handleLocationOptionChange = (event, newLocationOption) => {
    if (newLocationOption !== null) {
      if (type === "construction") {
        setStateContext({
          ...stateContext,
          reporter: {
            ...stateContext.reporter,
            locationOption: newLocationOption,
          },
        });
      } else if (type === "climate") {
        setStateContext({
          ...stateContext,
          climateReporter: {
            ...stateContext.climateReporter,
            locationOption: newLocationOption,
          },
        });
      }
    }
  };

  return (
    <ToggleButtonGroup
      value={type === "construction" ? reporter.locationOption : climateReporter.locationOption}
      exclusive
      onChange={handleLocationOptionChange}
      aria-label="text alignment"
      color="primary"
      fullWidth
      sx={{
        mb: 2,
        mt: 1,
      }}
    >
      {options.map((option) => (
        <ToggleButton
          key={`toggle-button-${option.name}`}
          value={option.name}
          aria-label={option.name}
          sx={{ borderRadius: 3, p: 1 }}
        >
          <Icon icon={option.icon} />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
