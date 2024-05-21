const prisma = require('../lib/prisma');

async function main() {

  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@admin.com',
      password: '12345678',
      role: 'ADMIN',
    },
  });

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
