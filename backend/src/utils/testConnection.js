import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('\x1b[31m[ERROR]: MONGODB_URI is not defined in backend/.env\x1b[0m');
  console.log('Please add your MongoDB Atlas connection string to backend/.env:');
  console.log('MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/restaurant_db?retryWrites=true&w=majority');
  process.exit(1);
}

console.log('\x1b[36mConnecting to MongoDB Atlas...\x1b[0m');

try {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log('\x1b[32m✔ SUCCESS: Connected to MongoDB Atlas successfully!\x1b[0m');
  console.log(`Host: ${conn.connection.host}`);
  console.log(`Database: ${conn.connection.name}`);
  console.log(`Ready State: ${conn.connection.readyState} (Connected)`);

  await mongoose.disconnect();
  console.log('\x1b[32m✔ Connection test completed and closed cleanly.\x1b[0m');
  process.exit(0);
} catch (error) {
  console.error('\x1b[31m✖ Connection Failed:\x1b[0m', error.message);
  console.log('\nTroubleshooting Checklist:');
  console.log('1. Check if your Atlas IP access list includes your current IP (or 0.0.0.0/0 for dev).');
  console.log('2. Check if your database username and password in the connection string are correct.');
  console.log('3. Ensure special characters in password are URL encoded (e.g., @ as %40).');
  process.exit(1);
}
