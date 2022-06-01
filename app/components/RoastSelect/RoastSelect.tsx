import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useFetcher } from "@remix-run/react";
import CreateRoastDialog from "./components/Dialog";

const filter = createFilterOptions<FilmOptionType>();

export default function RoastSelect() {
  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const optionFetcher = useFetcher();

  React.useEffect(() => {
    if (optionFetcher.type === "init") {
      optionFetcher.load("/roasts");
    }
  }, [optionFetcher]);
  const handleClose = () => {
    setDialogRoastName("");
    setIsOpen(false);
  };

  const [dialogRoastName, setDialogRoastName] = React.useState<string>("");
  if (!optionFetcher.data) return null;

  return (
    <React.Fragment>
      <input type="text" name="roastId" value={value?.id} hidden />

      <button onClick={() => setIsOpen(!isOpen)}>Open</button>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          console.log(newValue);

          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              setIsOpen(true);
              setDialogRoastName(newValue);
            });
          } else if (newValue && newValue.inputValue) {
            setIsOpen(true);
            setDialogRoastName(newValue.inputValue);
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        options={optionFetcher.data}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        groupBy={(option) => option?.roaster?.name}
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        sx={{ width: 300 }}
        renderInput={(params) => {
          return <TextField {...params} label="Select Roast" />;
        }}
      />
      <CreateRoastDialog
        handleClose={handleClose}
        handleDone={(value) => {
          console.log("handling the doneness with value", { value });
          setValue(value);
          setIsOpen(false);
        }}
        isOpen={isOpen}
        roastName={dialogRoastName}
      />
    </React.Fragment>
  );
}

interface FilmOptionType {
  inputValue?: string;
  name: string;
  id?: string;
  roaster?: { name?: string };
}
