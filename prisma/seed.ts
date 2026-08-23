import bcrypt from "bcrypt";
import prisma from "../src/config/prisma";

async function main() {
  console.log("Starting database seeding...");

  // 1. Seed Admin User
  const adminEmail = "admin@fixitnow.com";
  const rawPassword = "Admin@12345";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "FixItNow Admin",
      role: "ADMIN",
      status: "ACTIVE",
    },
    create: {
      name: "FixItNow Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // 2. Seed Baseline Categories
  const categories = [
    {
      name: "Plumbing",
      description: "Plumbing repair, leak fixes, and installation services",
    },
    {
      name: "Electrical",
      description: "Electrical wiring, fixture installations, and repairs",
    },
    {
      name: "Cleaning",
      description: "Home deep cleaning and routine maintenance services",
    },
    {
      name: "Painting",
      description: "Interior and exterior house painting services",
    },
    {
      name: "Carpentry",
      description: "Custom woodwork, furniture repair, and framing services",
    },
  ];

  let seededCategoryCount = 0;

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: {
        name: cat.name,
        description: cat.description,
      },
    });
    seededCategoryCount++;
  }

  console.log("✔ Seeding completed successfully!");
  console.log(`- Admin Account Provisioned: ${admin.email} (Role: ${admin.role})`);
  console.log(`- Baseline Categories Provisioned: ${seededCategoryCount}`);
}

main()
  .catch((err) => {
    console.error("✖ Database seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
