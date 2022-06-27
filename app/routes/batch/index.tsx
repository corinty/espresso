import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getAllBatches } from "~/models/batch.server";
import { formatShortDate } from "~/utils";

type LoaderData = {
  batches: Awaited<ReturnType<typeof getAllBatches>>;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: require("~/styles/batch.css") }];
};
export const loader: LoaderFunction = async ({ request }) => {
  const batches = await getAllBatches();

  return json<LoaderData>({ batches });
};

export default function BatchIndex() {
  const { batches } = useLoaderData<LoaderData>();
  return (
    <main>
      <h2>All Batches</h2>
      <div className="batch-list">
        {batches.map((batch) => {
          const { name, roaster } = batch.roast;
          return (
            <Link to={batch.id} className="single-batch" key={batch.id}>
              <div>
                <div>ID: {batch.id}</div>
                <div>Coffee: {name}</div>
                <div>Roaster: {roaster.name}</div>
              </div>
              <div>
                <div>Opened Date: {formatShortDate(batch.createdAt)}</div>

                {batch.roastDate && (
                  <div>Roast Date: {formatShortDate(batch.roastDate)}</div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
