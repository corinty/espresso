import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {};

export default function Containers() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
