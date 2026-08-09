const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupCustomerBusinesses() {
  console.log('--- Cleaning up orphaned Business Groups for CUSTOMER users ---');
  try {
    // Find all business groups owned by users with role 'CUSTOMER' that have 0 locations
    const customerGroups = await prisma.businessGroup.findMany({
      where: {
        owner: {
          role: 'CUSTOMER'
        }
      },
      include: {
        locations: true,
        subscriptions: true,
        owner: {
          select: { email: true, name: true }
        }
      }
    });

    console.log(`Found ${customerGroups.length} Business Group(s) owned by CUSTOMER accounts.`);

    let deletedCount = 0;
    for (const group of customerGroups) {
      if (group.locations.length === 0) {
        console.log(`Deleting empty BusinessGroup: "${group.name}" (ID: ${group.id}) for Customer ${group.owner?.email}...`);
        
        // Delete associated subscriptions first
        await prisma.subscription.deleteMany({
          where: { businessGroupId: group.id }
        });

        // Delete business group
        await prisma.businessGroup.delete({
          where: { id: group.id }
        });

        deletedCount++;
      } else {
        console.log(`Skipping BusinessGroup "${group.name}" because it has ${group.locations.length} location(s).`);
      }
    }

    console.log(`Cleanup complete! Successfully deleted ${deletedCount} orphaned customer business group(s).`);
  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupCustomerBusinesses();
