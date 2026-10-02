const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { seedSampleDocuments } = require('./services/seedService');

async function runSeed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rag-doctor';
  try {
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('Running seed script...');
    await seedSampleDocuments(true);
    console.log('Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

runSeed();
