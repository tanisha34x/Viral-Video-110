const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try to connect to MongoDB Atlas
    const conn = await mongoose.connect('mongodb+srv://minhajtalukder313:01609%40Sin@cluster0p2p.ki3je.mongodb.net/redirector?retryWrites=true&w=majority&appName=Cluster0p2p', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Will use local fallback storage...');
    // Don't exit the process, let the app work with fallback storage
  }
};

module.exports = connectDB;
