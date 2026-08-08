const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteAdmin() {
  const targetEmail = 'rajugariventures@gmail.com';
  try {
    const user = await prisma.user.findUnique({ where: { email: targetEmail } });
    if (!user) {
      console.log(`User with email "${targetEmail}" not found in database yet. It will be updated automatically on first login if registered, or run node promote-admin.js after registering.`);
      process.exit(0);
    }

    const updated = await prisma.user.update({
      where: { email: targetEmail },
      data: { role: 'SUPER_ADMIN' }
    });

    console.log(`Successfully granted SUPER_ADMIN access to: ${updated.email} (ID: ${updated.id})`);
  } catch (error) {
    console.error('Error promoting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

promoteAdmin();
