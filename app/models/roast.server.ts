import { prisma } from "~/db.server";

export const getAllRoasts = async () =>
  prisma.roast.findMany({
    include: { roaster: true },
    orderBy: { name: "asc" },
  });
