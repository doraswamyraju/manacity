const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Default task templates
const DEFAULT_TASKS = [
  { title: 'Add Business Hours', description: 'Configure operating hours for your business.', xpReward: 50, category: 'PROFILE', triggerCondition: 'hours' },
  { title: 'Register Category', description: 'Categorize your business to improve search ranking.', xpReward: 30, category: 'PROFILE', triggerCondition: 'category' },
  { title: 'Complete Contact Details', description: 'Add a valid contact phone number to your profile.', xpReward: 40, category: 'PROFILE', triggerCondition: 'phone' },
  { title: 'Link Social Profiles', description: 'Connect your Instagram, Facebook, or Twitter accounts.', xpReward: 50, category: 'PROFILE', triggerCondition: 'socialLinks' }
];

// Helper: Ensure default tasks exist in DB
async function seedTasksIfNeeded() {
  const count = await prisma.task.count();
  if (count === 0) {
    for (const task of DEFAULT_TASKS) {
      await prisma.task.create({ data: task });
    }
    console.log('Seeded default gamification tasks successfully.');
  }
}

// 1. Get location score and dynamic tasks list
exports.getLocationTasks = async (req, res) => {
  try {
    const { locationId } = req.params;
    await seedTasksIfNeeded();

    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: {
        taskProgress: { include: { task: true } },
        websites: true,
        reviews: true
      }
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found.' });
    }

    const allTasks = await prisma.task.findMany();
    
    // Evaluate task completion dynamically
    let totalScore = 0;
    let earnedXp = 0;
    const taskDetails = [];

    for (const task of allTasks) {
      let isCompleted = false;

      // Condition checking based on location properties
      if (task.triggerCondition === 'hours') {
        isCompleted = location.hours && Object.keys(location.hours).length > 0;
      } else if (task.triggerCondition === 'category') {
        isCompleted = !!location.category;
      } else if (task.triggerCondition === 'phone') {
        isCompleted = !!location.phone;
      } else if (task.triggerCondition === 'socialLinks') {
        isCompleted = location.socialLinks && Object.keys(location.socialLinks).length > 0;
      }

      if (isCompleted) {
        earnedXp += task.xpReward;
        totalScore += 25; // 25 points per task completed (4 default tasks = 100% score)

        // Save progress in DB if not already recorded
        const existingProgress = location.taskProgress.find(p => p.taskId === task.id);
        if (!existingProgress) {
          await prisma.taskProgress.create({
            data: {
              locationId: location.id,
              taskId: task.id,
              completed: true,
              completedAt: new Date()
            }
          });
        }
      }

      taskDetails.push({
        id: task.id,
        title: task.title,
        description: task.description,
        xpReward: task.xpReward,
        category: task.category,
        completed: isCompleted
      });
    }

    // Level calculation (e.g. Level 1 = 0-99 XP, Level 2 = 100-199 XP, etc.)
    const calculatedLevel = Math.floor(earnedXp / 100) + 1;

    // Update location stats in DB if changed
    if (location.xp !== earnedXp || location.level !== calculatedLevel) {
      await prisma.location.update({
        where: { id: locationId },
        data: { xp: earnedXp, level: calculatedLevel }
      });
    }

    // Streaks calculations (mocked for profile active setups)
    const activeStreak = 3; // mock active day streak

    res.json({
      status: 'success',
      score: Math.min(totalScore, 100),
      level: calculatedLevel,
      xp: earnedXp,
      nextLevelXp: calculatedLevel * 100,
      streak: activeStreak,
      tasks: taskDetails
    });
  } catch (error) {
    console.error('Get tasks details error:', error);
    res.status(500).json({ error: 'Failed to evaluate score and tasks details.' });
  }
};
