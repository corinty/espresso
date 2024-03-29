import type { Batch } from "@prisma/client";
import { prisma } from "~/db.server";
import { generateSlug } from "random-word-slugs";

const include = { roast: { include: { roaster: true } } };

export const getAllBatches = () =>
  prisma.batch.findMany({
    include: {
      roast: { include: { roaster: true } },
      ledgerEntires: { select: { dateIn: true, dateOut: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

export const getActiveBatch = async () => {
  const { value: id } = await prisma.meta.findUnique({
    rejectOnNotFound: true,
    where: { key: "active_batch_id" },
  });

  return prisma.batch.findFirst({
    rejectOnNotFound: true,
    where: {
      id,
    },
    include,
  });
};

export const createBatch = (data: Pick<Batch, "roastDate" | "roastId">) =>
  prisma.batch.create({
    data: { id: generateSlug(), ...data },
  });

export function getBatchById({ batchId }: { batchId: Batch["id"] }) {
  return prisma.batch.findUnique({
    rejectOnNotFound: true,
    where: { id: batchId },
    include: {
      roast: { include: { roaster: true } },
      ledgerEntires: { orderBy: { dateOut: "asc" } },
    },
  });
}
