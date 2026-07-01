const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get customers CRM leads list for a location
exports.getCustomers = async (req, res) => {
  try {
    const { locationId } = req.params;

    const customers = await prisma.customer.findMany({
      where: { locationId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      customers
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to retrieve CRM contacts.' });
  }
};

// 2. Submit/Capture a new Lead (Public contact form submission from generated website)
exports.captureLead = async (req, res) => {
  try {
    const { locationId, name, email, phone, notes } = req.body;

    if (!locationId || !name) {
      return res.status(400).json({ error: 'Location details and lead name are required.' });
    }

    const customer = await prisma.customer.create({
      data: {
        locationId,
        name,
        email,
        phone,
        notes,
        pipeline: 'LEAD'
      }
    });

    // Create a mock system notification for the business owner
    console.log(`[Notification Alert] New Lead captured for location ${locationId}: ${name}`);

    res.status(201).json({
      status: 'success',
      customer
    });
  } catch (error) {
    console.error('Capture lead error:', error);
    res.status(500).json({ error: 'Failed to record contact inquiry.' });
  }
};

// 3. Update customer pipeline status
exports.updateCustomerPipeline = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { pipeline, notes } = req.body;

    const allowedPipelines = ['LEAD', 'CONTACTED', 'CONVERTED', 'LOST'];
    if (pipeline && !allowedPipelines.includes(pipeline)) {
      return res.status(400).json({ error: 'Invalid CRM pipeline status.' });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer contact not found.' });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        pipeline: pipeline || customer.pipeline,
        notes: notes !== undefined ? notes : customer.notes
      }
    });

    res.json({
      status: 'success',
      customer: updatedCustomer
    });
  } catch (error) {
    console.error('Update CRM pipeline error:', error);
    res.status(500).json({ error: 'Failed to update contact status.' });
  }
};
