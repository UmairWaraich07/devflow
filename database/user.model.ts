import { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  location?: string;
  picture: string;
  portfolioWebsite?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  joined: Date;
}

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String },
  bio: { type: String },
  location: { type: String },
  picture: {
    type: String,
    required: true,
  },
  portfolioWebsite: { type: String },
  reputation: { type: Number, default: 0 },
  saved: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  joined: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
