import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getContainerById } from "~/models/container.server";

type LoaderData = {
  container: NonNullable<Awaited<ReturnType<typeof getContainerById>>>;
  path: any;
};

export const loader: LoaderFunction = async ({ params }) => {
  const container = await getContainerById({
    containerId: params.containerId!,
  });

  if (!container) return redirect("/containers");

  return json<LoaderData>({ container: container!, path: params });
};

export default function Container() {
  const { container, path } = useLoaderData<LoaderData>();

  const batch = container.batch;

  return (
    <>
      <Link
        to="/containers"
        type="button"
        className="px-3 py-1 font-bold text-white rounded bg-slate-500 hover:bg-slate-900"
      >
        Back
      </Link>
      <h2>This is the individual container</h2>
      <div>Batch ID: {container.batchId}</div>
      <div>Container Id: {container?.id}</div>
      <div>Coffee Name: {batch.roast.name}</div>
    </>
  );
}
