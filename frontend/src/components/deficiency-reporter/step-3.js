import { Typography, Divider, FormGroup, FormControlLabel, Checkbox, TextField } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useDeficiencyContext } from "../../providers/deficiency-provider";

export function Step3({ step }) {
  const { deficiencyContext, setDeficiencyContext } = useDeficiencyContext();
  const { email, phoneNumber, privacyPolicy, dataHandling } = deficiencyContext;

  const handleEmailChange = (event) => {
    setDeficiencyContext({
      ...deficiencyContext,
      email: event.target.value,
    });
  };

  const handlePhoneNumberChange = (event) => {
    setDeficiencyContext({
      ...deficiencyContext,
      phoneNumber: event.target.value,
    });
  };

  const handlePrivacyPolicyChange = () => {
    setDeficiencyContext({
      ...deficiencyContext,
      privacyPolicy: !deficiencyContext.privacyPolicy,
    });
  };

  const handledataHandlingChange = () => {
    setDeficiencyContext({
      ...deficiencyContext,
      dataHandling: !deficiencyContext.dataHandling,
    });
  };

  const privacyLinkObject = (
    <>
      <>
        Ich habe die&nbsp;
      </>
      <a href='https://huenfeld.de/datenschutz-huenfeld.html' target={"_blank"} rel="noreferrer">Datenschutzerklärung</a>
      <>
        &nbsp;gelesen und verstanden.
      </>
    </>
  )

  return (
    <>
      {" "}
      <Typography sx={{ mb: 1 }}>{step.infoText}</Typography>
      <Divider sx={{ mb: 2, mt: 2 }} />
      <Typography sx={{ mb: 1, mt: 1, fontWeight: 600, fontSize: "14px" }}>{step.emailLabel}</Typography>
      <TextField
        id="deficiency-email-textfield"
        required
        fullWidth
        size="small"
        placeholder={step.emailPlaceholder}
        value={email}
        onChange={handleEmailChange}
        inputProps={{ maxLength: 50 }}
        sx={{ mb: 1 }}
        type="email"
      />
      <Typography sx={{ mb: 1, mt: 1, fontWeight: 600, fontSize: "14px" }}>{step.phoneLabel}</Typography>
      <TextField
        id="deficiency-phone-textfield"
        fullWidth
        size="small"
        placeholder={step.phonePlaceholder}
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        inputProps={{ maxLength: 50 }}
        sx={{ mb: 1 }}
      />
      <Divider sx={{ mb: 2, mt: 2 }} />
      <FormGroup
        sx={{
          mt: 1,
        }}
      >
        <FormControlLabel
          sx={{ alignItems: "flex-start" }}
          control={
            <Checkbox
              checkedIcon={<CheckCircleOutlineIcon />}
              icon={<RadioButtonUncheckedIcon />}
              checked={dataHandling}
              onChange={handledataHandlingChange}
              sx={{
                marginTop: -1,
              }}
            />
          }
          label={step.dataHandling}
        />
      </FormGroup>
      <FormGroup sx={{ mt: 1, mb: 2 }}>
        <FormControlLabel
          sx={{ alignItems: "flex-start" }}
          control={
            <Checkbox
              checkedIcon={<CheckCircleOutlineIcon />}
              icon={<RadioButtonUncheckedIcon />}
              checked={privacyPolicy}
              onChange={handlePrivacyPolicyChange}
              // onClick={privacyPolicy != privacyPolicy}
              sx={{
                marginTop: -1,
              }}
              style= {{ pointerEvents: "auto" }}
            />
          }
          style= {{ pointerEvents: "auto" }}
          label={privacyLinkObject}
        />
      </FormGroup>
    </>
  );
}
