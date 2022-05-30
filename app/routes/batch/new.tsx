import type { Batch } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
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
  const { roasts } = useLoaderData<LoaderData>();
  return (
    <>
      <h2>Create New Batch</h2>
      <form method="post">
        <p>
          <label>
            Roast:
            <select name="roastId">
              <option hidden></option>
              {roasts.map((roast) => (
                <option key={roast.id} value={roast.id}>
                  {roast.name} | {roast.roaster.name}
                </option>
              ))}
            </select>
          </label>
        </p>
        <p>
          <label>
            Roast Date: <input type="date" name="roastDate" />
          </label>
        </p>
        <button type="submit">Create</button>
      </form>
    </>
  );
}
