require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Property = require('./src/models/Property');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('✅ Connected to MongoDB for seeding');

    // Create a demo user
    let user = await User.findOne({ email: 'demo@propspace.com' });
    if (!user) {
      user = await User.create({
        username: 'PropSpace_Agent',
        email: 'demo@propspace.com',
        password: 'password123',
        phone: '+1 234 567 8900',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
      });
      console.log('✅ Demo user created');
    }

    // Check if properties already exist
    const propertyCount = await Property.countDocuments();
    if (propertyCount === 0) {
      // Create some demo properties
      await Property.insertMany([
        {
          title: 'Modern Downtown Apartment',
          description: 'A beautiful, fully furnished 2-bedroom apartment located in the heart of the city. Features floor-to-ceiling windows, modern kitchen appliances, and access to a rooftop pool and gym.',
          price: 2500,
          city: 'New York',
          country: 'USA',
          type: 'Apartment',
          listingType: 'rent',
          imageUrls: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=800&q=80'
          ],
          author: user._id
        },
        {
          title: 'Luxury Beachfront Villa',
          description: 'Experience ultimate luxury in this stunning 5-bedroom villa with private beach access. Includes an infinity pool, spacious outdoor entertainment area, and smart home technology.',
          price: 1500000,
          city: 'Miami',
          country: 'USA',
          type: 'House',
          listingType: 'sale',
          imageUrls: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
          ],
          author: user._id
        },
        {
          title: 'Cozy City Studio',
          description: 'Perfect for young professionals, this compact but well-designed studio offers everything you need. Located near major transit lines and popular cafes.',
          price: 1200,
          city: 'London',
          country: 'UK',
          type: 'Studio',
          listingType: 'rent',
          imageUrls: [
            'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80'
          ],
          author: user._id
        },
        {
          title: 'Spacious Suburban Family Home',
          description: 'A wonderful 4-bedroom house with a large backyard, perfect for families. Located in a quiet neighborhood with top-rated schools nearby. Features a newly renovated kitchen and 2-car garage.',
          price: 450000,
          city: 'Austin',
          country: 'USA',
          type: 'House',
          listingType: 'sale',
          imageUrls: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
          ],
          author: user._id
        }
      ]);
      console.log('✅ 4 demo properties seeded successfully');
    } else {
      console.log(`✅ Database already has ${propertyCount} properties`);
    }

    mongoose.disconnect();
    console.log('✅ Seeding complete');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
