const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create a test user
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      username: 'demouser',
      password: hashedPassword,
      fullName: 'Demo User',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      videos: {
        create: [
          {
            title: 'Beautiful Sunset',
            description: 'Amazing sunset view',
            url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            views: 100,
          },
          {
            title: 'Mountain Adventure',
            description: 'Hiking in the mountains',
            url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
            views: 250,
          },
          {
            title: 'Ocean Waves',
            description: 'Relaxing beach video',
            url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
            views: 150,
          },
        ],
      },
    },
    include: {
      videos: true,
    },
  });

  console.log(`Created user: ${user.username} with ${user.videos.length} videos`);
  
  // Create a second user
  const hashedPassword2 = await bcrypt.hash('123456', 10);
  
  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      username: 'janedoe',
      password: hashedPassword2,
      fullName: 'Jane Doe',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      videos: {
        create: [
          {
            title: 'City Life',
            description: 'Downtown city vibes',
            url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
            views: 300,
          },
        ],
      },
    },
    include: {
      videos: true,
    },
  });

  console.log(`Created user: ${user2.username} with ${user2.videos.length} videos`);

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });