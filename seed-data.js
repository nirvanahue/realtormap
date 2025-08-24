// Sample data for Realty Marauders demo
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

async function seedData() {
  console.log("Seeding database with sample listings...");
  
  for (const listing of sampleListings) {
    try {
      const response = await fetch('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listing),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created listing: ${listing.title}`);
      } else {
        console.error(`❌ Failed to create listing: ${listing.title}`);
      }
    } catch (error) {
      console.error(`❌ Error creating listing ${listing.title}:`, error);
    }
  }
  
  console.log("Seeding complete!");
}

// Run the seeding function
seedData();
