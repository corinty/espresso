import type { Batch } from "@prisma/client";
import { Form, Link, useOutletContext } from "@remix-run/react";

export default function ProcessBatch() {
  const batch = useOutletContext<Batch>();
  return (
    <>
      <style>
        {`input{
          width: 100%
        }`}
      </style>
      <h4>Process</h4>
      <Form className="grid">
        <label>
          Batch Id
          <input type="text" name="batchId" disabled value={batch.id} />
        </label>
        <label htmlFor="">
          Container Id
          <input type="text" name="containerId" />
        </label>

        <button type="submit">Add</button>
      </Form>
      <Link to={`/batch/${batch.id}`}>Back</Link>
    </>
  );
}
