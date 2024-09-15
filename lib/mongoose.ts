import mongoose from 'mongoose';

let isConnected = false;  // Variable to track the connection status to the database

/**
 * Connects to the MongoDB database.
 * This function ensures that only one connection is established during the application's lifecycle.
 * It checks if a connection already exists, and if not, attempts to create a new one.
 */
export const connectToDB = async () => {
  // Set mongoose to use strict query filtering (disallows certain types of queries)
  mongoose.set('strictQuery', true);

  // Check if the MongoDB URI is defined in the environment variables
  if (!process.env.MONGODB_URI) {
    return console.log('MONGODB_URI is not defined');  // Log an error if the URI is missing
  }

  // If a database connection already exists, reuse it
  if (isConnected) {
    return console.log('=> using existing database connection');
  }

  // Try to establish a new connection to the MongoDB database
  try {
    await mongoose.connect(process.env.MONGODB_URI);  // Connect to the database using the URI from environment variables

    isConnected = true;  // Set the connection status to true once connected

    console.log('MongoDB Connected');  // Log a success message
  } catch (error) {
    console.log(error);  // Log any connection errors
  }
};
