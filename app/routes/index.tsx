import { Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <section>We are going to go at it from the very beginning</section>
      <Outlet />
    </main>
  );
}
