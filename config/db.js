import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected To MongoDB ${connect.connection.host}`.america.bold
    );
  } catch (error) {
    console.log(`Error in MongoDB ${error}`.bgRed);
  }
};

export default connectDB;
