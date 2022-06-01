import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import type { Roast } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Transition } from "./Transition";

export default function CreateRoastDialog({
  isOpen,
  handleClose,
  handleDone,
  roastName,
}: {
  isOpen: boolean;
  roastName: string;
  handleDone: (e: Roast) => void;
  handleClose: () => void;
}) {
  const fetcher = useFetcher();

  const ref = useRef(null);

  useEffect(() => {
    if (fetcher.type == "done" && fetcher.data.ok) {
      //@ts-ignore
      console.log("we should do it?");

      ref.current.reset();
      handleDone(fetcher.data.roast as Roast);
    }
  }, [fetcher, handleDone]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullScreen
      TransitionComponent={Transition}
    >
      <fetcher.Form
        ref={ref}
        method="post"
        action="/roast/new"
        onSubmit={(e) => {}}
      >
        <DialogTitle>Add new Coffee Roast</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <TextField
              margin="dense"
              id="coffeeName"
              name="coffeeName"
              defaultValue={roastName}
              label="title"
              type="text"
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              name="roasterName"
              label="Roaster Name"
              type="text"
              variant="standard"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={fetcher.state === "submitting"}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            disabled={fetcher.state === "submitting" || fetcher.type === "done"}
            type="submit"
          >
            Add
          </Button>
        </DialogActions>
      </fetcher.Form>
    </Dialog>
  );
}
