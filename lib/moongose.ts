import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL is missing!");

  if (isConnected) return console.log("MONGOBD is already connected!");

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "devflow",
    });
    isConnected = true;
    console.log("MONGODB is connected");
  } catch (error) {
    console.log("Failed to connect MONGODB", error);
  }
};
