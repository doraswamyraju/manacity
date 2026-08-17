const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  const email = 'test@manacity.in';
  const plainPassword = 'BOHPM6139n@';
  const name = 'ManaCity Test Admin';
  const role = 'BUSINESS_OWNER';

  try {
    console.log(`Setting up test user: ${email}...`);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          name,
          role
        }
      });
      console.log(`Updated existing user: ${user.email} (ID: ${user.id})`);
    } else {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role,
          provider: 'LOCAL'
        }
      });
      console.log(`Created new user: ${user.email} (ID: ${user.id})`);
    }

    // Ensure BusinessGroup exists
    let businessGroup = await prisma.businessGroup.findFirst({
      where: { ownerId: user.id }
    });

    if (!businessGroup) {
      businessGroup = await prisma.businessGroup.create({
        data: {
          name: "Rajugari Ventures - ManaCity Test",
          ownerId: user.id,
          description: "Official ManaCity Platform Test Business Account",
          country: "India",
          state: "Andhra Pradesh",
          city: "Tirupati"
        }
      });
      console.log(`Created BusinessGroup: ${businessGroup.name} (ID: ${businessGroup.id})`);
    } else {
      console.log(`Existing BusinessGroup found: ${businessGroup.name}`);
    }

    // Ensure Subscription exists
    let subscription = await prisma.subscription.findFirst({
      where: { businessGroupId: businessGroup.id }
    });

    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          businessGroupId: businessGroup.id,
          tier: 'PREMIUM',
          status: 'ACTIVE',
          locationLimit: 10,
          websiteLimit: 5
        }
      });
      console.log(`Created ACTIVE PREMIUM Subscription for ${businessGroup.name}`);
    } else {
      console.log(`Existing Subscription tier: ${subscription.tier}`);
    }

    console.log('----------------------------------------------------');
    console.log('SUCCESS! Test Credentials Ready:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${plainPassword}`);
    console.log('----------------------------------------------------');

  } catch (error) {
    console.error('Error setting up test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
