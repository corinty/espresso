
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { createLedgerEntry } from "~/models/containerLedger.server";
import { zfd } from "zod-form-data";


export const action: ActionFunction = async ({ request }) => {
  const { batchId, containerId } = schema.parse(await request.formData());

  const { container, ledgerEntry } = await createLedgerEntry({
    batchId,
    containerId,
  });

  return json({ container, ledgerEntry });
};
