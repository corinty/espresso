import { json } from "@remix-run/server-runtime";

export const action = async ({ request }) => {
  try {
    const data = await request.formData();
    return json({ ledger, ok: true });
  } catch (error) {
    return json({ error: error.message });
  }
};
