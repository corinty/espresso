import { Button, TextField } from "@mui/material";
import { useLoaderData, Form } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import RoastSelect from "~/components/RoastSelect";
import { createBatch } from "~/models/batch.server";
import { getAllRoasts } from "~/models/roast.server";

type LoaderData = {
  roasts: Awaited<ReturnType<typeof getAllRoasts>>;
};

export const loader: LoaderFunction = async () => {
  const roasts = await getAllRoasts();
  return json<LoaderData>({ roasts });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const roastDate = formData.get("roastDate") as string;
  const roastId = formData.get("roastId") as string;

  if (!roastId) return null;
  const { id } = await createBatch({
    roastDate: new Date(roastDate!),
    roastId,
  });

  return redirect(`/batch/${id}`);
};

export default function NewBatch() {
  return (
    <div className="p-1 mx-auto">
      <h2>Create New Batch</h2>
      <Form method="post">
        <RoastSelect />
        <p>
          <label>
            Roast Date: <input type="date" name="roastDate" />
          </label>
        </p>
        <Button variant="contained" type="submit">
          Create Batch
        </Button>
      </Form>
    </div>
  );
}
