import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useFetcher } from "@remix-run/react";
import CreateRoastDialog from "./components/Dialog";

const filter = createFilterOptions<FilmOptionType>();

export default function RoastSelect() {
  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const roastFetcher = useFetcher();

  React.useEffect(() => {
    if (roastFetcher.type === "init") {
      roastFetcher.load("/roasts");
    }
  }, [roastFetcher]);

  const handleClose = () => {
    setDialogRoastName("");
    setIsOpen(false);
  };

  const [dialogRoastName, setDialogRoastName] = React.useState<string>("");
  if (!roastFetcher.data) return null;

  return (
    <React.Fragment>
      <input type="text" value={value?.id} name="roastId" hidden readOnly />
      <Autocomplete
        value={value}
        fullWidth
        style={{ width: "100%" }}
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
        options={roastFetcher.data}
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
        renderOption={(props, option) => (
          <ListItem {...props}>
            <ListItemText primary={option.name} />
            <ListItemSecondaryAction>
              <roastFetcher.Form method="delete" action={`/roast/${option.id}`}>
                <IconButton edge="end" aria-label="delete" type="submit">
                  <DeleteForeverIcon />
                </IconButton>
              </roastFetcher.Form>
            </ListItemSecondaryAction>
          </ListItem>
        )}
        sx={{ width: 300 }}
        renderInput={(params) => {
          return <TextField {...params} label="Select Roast" />;
        }}
      />
      <CreateRoastDialog
        handleClose={handleClose}
        handleDone={(value) => {
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
