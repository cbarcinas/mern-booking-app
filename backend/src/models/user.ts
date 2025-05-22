import mongoose from 'mongoose';

// Typescript type
export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// It is import to declare the type (above) because when we build the frontend,
// typescript will give us errors if we are missing any of the properties

// Schema for user
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 160,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
