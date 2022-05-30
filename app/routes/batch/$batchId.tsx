import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getBatchById } from "~/models/batch.server";

type LoaderData = {
  batch: NonNullable<Awaited<ReturnType<typeof getBatchById>>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const batch = await getBatchById({ batchId: params.batchId! });
  console.log(batch);

  return json<LoaderData>({ batch: batch! });
};

export default function Batch() {
  const { batch } = useLoaderData<LoaderData>();
  return (
    <>
      <h2>Batch: {batch.id} </h2>

      <div>Coffee: {batch.roast.name}</div>
      <div>Roaster: {batch.roast.roaster.name}</div>
      <div>
        Roast Date:{" "}
        {new Date(batch.roastDate)?.toLocaleDateString("en-US", {
          dateStyle: "short",
        })}
      </div>

      <section>
        <Outlet context={batch} />
      </section>
    </>
  );
}
