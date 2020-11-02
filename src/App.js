import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import "./App.css";
import pdfBase from "./certificate.pdf";
import { downloadBlob } from "./dom-utils";
import { generatePdf } from "./pdf-util";
import { USERS } from "./profiles";

function App() {
  const [value, setValue] = React.useState(null);
  const [user, setUser] = React.useState(null);

  const handleRadioChange = (event) => {
    const user = USERS.filter((user) => user.id === event.target.value)[0];
    setUser(user);
    setValue(event.target.value);
  };

  const handleButtonClick = async (_) => {
    const creationInstant = new Date();
    const creationDate = creationInstant.toLocaleDateString("fr-CA");
    const formattedCreationDate = creationDate.replaceAll("-", "/");
    const creationHour = creationInstant.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedCreationHour = creationHour.replace(":", "-");
    const profile = {
      ...user,
      datesortie: formattedCreationDate,
      heuresortie: creationHour,
    };
    const pdfBlob = await generatePdf(profile, "achats", pdfBase);
    downloadBlob(
      pdfBlob,
      `attestation-${creationDate}_${formattedCreationHour}.pdf`
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <FormControl component="fieldset">
          <RadioGroup name="subject" value={value} onChange={handleRadioChange}>
            {USERS.map((user) => <FormControlLabel value={user.id} control={<Radio />} label={user.firstname} />)}
          </RadioGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            Generate
          </Button>
        </FormControl>
      </header>
    </div>
  );
}

export default App;
