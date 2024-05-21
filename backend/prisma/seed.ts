const prisma = require("../common/prismaClient");
const bcrypt = require("bcrypt");

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
