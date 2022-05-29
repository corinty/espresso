import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const randomDate = () =>
    new Date(+new Date() - Math.floor(Math.random() * 10000000000));

  const roaster = await prisma.roaster.create({
    data: {
      name: "Onyx Coffee Labs",
      roasts: {
        create: [{ name: "Southern Weather" }, { name: "The Big One" }],
      },
    },
  });

  const roast = await prisma.roast.create({
    data: { name: "Tropical Weather", roasterId: roaster.id },
  });

  const bag = await prisma.bag.create({
    data: {
      roastDate: randomDate(),
      roastId: roast.id,
    },
  });

  [1, 22, 45, 35, 22].forEach(async (id) => {
    await prisma.container.create({
      data: { id: id.toString(), coffeeId: bag.id },
    });
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
