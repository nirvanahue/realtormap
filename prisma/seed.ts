import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleListings = [
  {
    owner: "0x1234567890123456789012345678901234567890",
    title: "Gryffindor Tower Suite",
    desc: "A magnificent suite in the iconic Gryffindor Tower with views of the Forbidden Forest. Features a roaring fireplace and enchanted ceiling that shows the night sky.",
    price: 1500,
    lat: 40.7128,
    lng: -74.0060,
    house: "GRYFFINDOR",
    images: JSON.stringify(["/placeholder-house.jpg"])
  },
  {
    owner: "0x2345678901234567890123456789012345678901",
    title: "Slytherin Dungeon Chambers",
    desc: "Elegant chambers beneath the lake with green-tinted windows and silver furnishings. Perfect for those who appreciate ambition and cunning.",
    price: 1800,
    lat: 40.7589,
    lng: -73.9851,
    house: "SLYTHERIN",
    images: JSON.stringify(["/placeholder-house.jpg"])
  },
  {
    owner: "0x3456789012345678901234567890123456789012",
    title: "Ravenclaw Eagle's Nest",
    desc: "A cozy apartment in the Ravenclaw Tower with a library and study nooks. Ideal for scholars and those who value wisdom.",
    price: 1200,
    lat: 40.7505,
    lng: -73.9934,
    house: "RAVENCLAW",
    images: JSON.stringify(["/placeholder-house.jpg"])
  },
  {
    owner: "0x4567890123456789012345678901234567890123",
    title: "Hufflepuff Badger Burrow",
    desc: "A warm and welcoming home near the kitchens with plenty of space for gatherings. Perfect for those who value loyalty and hard work.",
    price: 1000,
    lat: 40.7829,
    lng: -73.9654,
    house: "HUFFLEPUFF",
    images: JSON.stringify(["/placeholder-house.jpg"])
  },
  {
    owner: "0x5678901234567890123456789012345678901234",
    title: "Diagon Alley Shop",
    desc: "A charming shop space in the heart of Diagon Alley, perfect for magical commerce. Includes living quarters above the store.",
    price: 2200,
    lat: 40.7648,
    lng: -73.9808,
    house: "GRYFFINDOR",
    images: JSON.stringify(["/placeholder-house.jpg"])
  },
  {
    owner: "0x6789012345678901234567890123456789012345",
    title: "Hogsmeade Cottage",
    desc: "A quaint cottage in the magical village of Hogsmeade with views of Hogwarts Castle. Features a garden with magical plants.",
    price: 900,
    lat: 40.7568,
    lng: -73.9745,
    house: "HUFFLEPUFF",
    images: JSON.stringify(["/placeholder-house.jpg"])
  }
];

const sampleAgents = [
  {
    address: "0x1234567890123456789012345678901234567890",
    house: "GRYFFINDOR",
    points: 150
  },
  {
    address: "0x2345678901234567890123456789012345678901",
    house: "SLYTHERIN",
    points: 200
  },
  {
    address: "0x3456789012345678901234567890123456789012",
    house: "RAVENCLAW",
    points: 180
  },
  {
    address: "0x4567890123456789012345678901234567890123",
    house: "HUFFLEPUFF",
    points: 120
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.listing.deleteMany();
  await prisma.agent.deleteMany();

  // Create sample agents
  for (const agent of sampleAgents) {
    await prisma.agent.create({
      data: agent
    });
    console.log(`✅ Created agent: ${agent.address} (${agent.house})`);
  }

  // Create sample listings
  for (const listing of sampleListings) {
    await prisma.listing.create({
      data: listing
    });
    console.log(`✅ Created listing: ${listing.title}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
