import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getContainers } from "~/models/container.server";

type LoaderData = {
  containerList: Awaited<ReturnType<typeof getContainers>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const containers = await getContainers();

  return json<LoaderData>({ containerList: containers });
};

export default function ContainerIndex() {
  const { containerList } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>List of Containers</h1>
      <div className="grid w-1/2 gap-2">
        {containerList.map(
          ({
            id,
            batch: {
              roast: { name },
            },
          }) => {
            return (
              <Link
                to={`/containers/${id}`}
                className="flex-col justify-between p-2 border-2 border-solid"
                key={id}
              >
                <div>Container Id: {id}</div>
                <div>Coffee Name: {name}</div>
              </Link>
            );
          }
        )}
      </div>
    </>
  );
}
