import type { Batch } from "@prisma/client";
import { prisma } from "~/db.server";

export const createBatch = (data: Pick<Batch, "roastDate" | "roastId">) =>
  prisma.batch.create({ data: { openedDate: new Date(), ...data } });

export function getBatchById({ batchId }: { batchId: Batch["id"] }) {
  return prisma.batch.findUnique({
    where: { id: batchId },
    include: { containers: true, roast: { include: { roaster: true } } },
  });
}
