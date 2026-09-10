import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import BloodRequest from './models/BloodRequest.js';
import DonationRequest from './models/DonationRequest.js';
import Chat from './models/Chat.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    await connectDB();
    const results = await Promise.all([
      User.deleteMany({}),
      BloodRequest.deleteMany({}),
      DonationRequest.deleteMany({}),
      Chat.deleteMany({}),
    ]);

    console.log('Database cleared:', {
      users: results[0].deletedCount,
      bloodRequests: results[1].deletedCount,
      donationRequests: results[2].deletedCount,
      chats: results[3].deletedCount,
    });
    process.exit(0);
  } catch (error) {
    console.error('Unable to clear database:', error);
    process.exit(1);
  }
};

clearDatabase();
