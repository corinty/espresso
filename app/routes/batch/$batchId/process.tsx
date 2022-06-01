import { Button, TextField } from "@mui/material";
import type { Batch } from "@prisma/client";
import { Form, useOutletContext, useNavigate } from "@remix-run/react";

import { json } from "@remix-run/server-runtime";
import { createLedgerEntry } from "~/models/containerLedger.server";

export const action = async ({ request }) => {
  const data = await request.formData();

  const { container, ledgerEntry } = await createLedgerEntry({
    batchId: data.get("batchId"),
    containerId: data.get("containerId"),
  });
  return json({ container, ledgerEntry });
};

export default function ProcessBatch() {
  const batch = useOutletContext<Batch>();
  const navigate = useNavigate();
  return (
    <>
      <h4>Process</h4>
      <form method="post">
        <input type="text" name="batchId" hidden value={batch.id} readOnly />
        <TextField
          fullWidth
          onKeyDown={(e) => {
            if (e.code === "Escape") navigate("..");
          }}
          type={"text"}
          inputProps={{ inputMode: "numeric" }}
          label="Container ID"
          required
          autoFocus
          name="containerId"
        ></TextField>

        <div
          style={{
            gap: 25,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            style={{ margin: "20px 0" }}
            variant="outlined"
            onClick={() => navigate("..")}
          >
            Done
          </Button>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </div>
      </form>
    </>
  );
}
