const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Default templates for quick replies
const DEFAULT_REPLY_TEMPLATES = [
  { title: 'Thank You (Positive)', content: 'Thank you so much for your feedback! We look forward to serving you again soon.', ratingMatch: 5 },
  { title: 'Apology (Negative)', content: 'We apologize for your experience. Please reach out to us directly so we can resolve this.', ratingMatch: 1 }
];

async function seedTemplatesIfNeeded() {
  const count = await prisma.replyTemplate.count();
  if (count === 0) {
    for (const temp of DEFAULT_REPLY_TEMPLATES) {
      await prisma.replyTemplate.create({ data: temp });
    }
  }
}

// 1. Get reviews and reply templates for a location
exports.getReviews = async (req, res) => {
  try {
    const { locationId } = req.params;
    await seedTemplatesIfNeeded();

    const reviews = await prisma.review.findMany({
      where: { locationId },
      orderBy: { createdAt: 'desc' }
    });

    const templates = await prisma.replyTemplate.findMany();

    res.json({
      status: 'success',
      reviews,
      templates
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
};

// 2. Submit a review via public feedback page
exports.submitReview = async (req, res) => {
  try {
    const { locationId, authorName, rating, comment } = req.body;

    if (!locationId || !authorName || !rating) {
      return res.status(400).json({ error: 'Location details, author name, and rating are required.' });
    }

    // Evaluate sentiment based on rating
    let sentiment = 'neutral';
    if (rating >= 4) sentiment = 'positive';
    else if (rating <= 2) sentiment = 'negative';

    const review = await prisma.review.create({
      data: {
        locationId,
        authorName,
        rating: parseInt(rating),
        comment,
        sentiment,
        source: 'MANUAL'
      }
    });

    res.status(201).json({
      status: 'success',
      review
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ error: 'Failed to post feedback.' });
  }
};

// 3. Reply to a review
exports.replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ error: 'Reply text cannot be empty.' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        replyText,
        repliedAt: new Date()
      }
    });

    res.json({
      status: 'success',
      review: updatedReview
    });
  } catch (error) {
    console.error('Reply review error:', error);
    res.status(500).json({ error: 'Failed to record response.' });
  }
};
