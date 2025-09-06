import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  gender: "male" | "female";
  saltValue: string; 
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    saltValue: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
