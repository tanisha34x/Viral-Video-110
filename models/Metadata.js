const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// JSON file fallback paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const METADATA_FILE = path.join(DATA_DIR, 'metadata.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const metadataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Default Facebook Share Title'
  },
  adestraLink: {
    type: String,
    required: true,
    default: 'https://your-adestra-link.com'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Helper functions for JSON file fallback
const readJSONFile = () => {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      const data = fs.readFileSync(METADATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading JSON file:', error);
  }
  return {
    title: "Default Facebook Share Title",
    adestraLink: "https://your-adestra-link.com",
    lastUpdated: new Date().toISOString()
  };
};

const writeJSONFile = (data) => {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(METADATA_FILE, JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error writing JSON file:', error);
    throw error;
  }
};

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Enhanced static methods with fallback
metadataSchema.statics.getSingle = async function() {
  if (isMongoConnected()) {
    try {
      let metadata = await this.findOne();
      if (!metadata) {
        // Try to migrate from JSON file if exists
        const jsonData = readJSONFile();
        metadata = await this.create(jsonData);
      }
      return metadata;
    } catch (error) {
      console.error('MongoDB read error, falling back to JSON:', error.message);
      return readJSONFile();
    }
  } else {
    return readJSONFile();
  }
};

metadataSchema.statics.updateSingle = async function(updateData) {
  if (isMongoConnected()) {
    try {
      let metadata = await this.findOne();
      if (!metadata) {
        metadata = await this.create(updateData);
      } else {
        Object.assign(metadata, updateData);
        metadata.lastUpdated = new Date();
        await metadata.save();
      }
      // Also update JSON file as backup
      writeJSONFile({
        title: metadata.title,
        adestraLink: metadata.adestraLink,
        lastUpdated: metadata.lastUpdated
      });
      return metadata;
    } catch (error) {
      console.error('MongoDB write error, falling back to JSON:', error.message);
      return writeJSONFile(updateData);
    }
  } else {
    return writeJSONFile(updateData);
  }
};

module.exports = mongoose.model('Metadata', metadataSchema);
