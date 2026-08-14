const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

// 1. Convert Lead to Sale
router.post('/leads/:id/convert', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { saleAmount, saleNotes } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        status: 'CONVERTED',
        saleAmount: Number(saleAmount) || 0,
        saleNotes: saleNotes || '',
        convertedAt: new Date()
      }
    });

    return res.status(200).json({ message: 'Lead converted to sale successfully!', lead });
  } catch (error) {
    console.error('Error converting lead to sale:', error);
    return res.status(500).json({ error: 'Failed to convert lead to sale' });
  }
});

// 2. Set Follow-up Reminder
router.post('/leads/:id/reminder', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reminderDate, reminderNote } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        reminderDate: new Date(reminderDate),
        reminderNote: reminderNote || ''
      }
    });

    return res.status(200).json({ message: 'Reminder set successfully!', lead });
  } catch (error) {
    console.error('Error setting lead reminder:', error);
    return res.status(500).json({ error: 'Failed to set lead reminder' });
  }
});

// 3. Update Lead Details (Status, Priority, Notes)
router.patch('/leads/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, notes } = req.body;

    const data = {};
    if (status) data.status = status;
    if (priority) data.priority = priority;
    if (notes !== undefined) data.notes = notes;

    const lead = await prisma.lead.update({
      where: { id },
      data
    });

    return res.status(200).json({ message: 'Lead updated successfully!', lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return res.status(500).json({ error: 'Failed to update lead' });
  }
});

// 4. Delete Lead
router.delete('/leads/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.lead.delete({ where: { id } });
    return res.status(200).json({ message: 'Lead deleted successfully!' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({ error: 'Failed to delete lead' });
  }
});

module.exports = router;
