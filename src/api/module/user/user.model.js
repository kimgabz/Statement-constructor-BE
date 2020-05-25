import mongoose from 'mongoose';
// import bcrytjs from 'bcryptjs';

const { Schema } = mongoose;
const UserSchema = new Schema({
  // No longer needed because of social media authentication
  // email: {
  //   type: String,
  //   required: true,
  //   lowercase: true,
  //   unique: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  // },
  local: {
    name: { type: String },
    email: { type: String },
    password: { type: String },
  },
  google: {
    email: { type: String },
    id: { type: String },
    displayName: { type: String },
    token: { type: String },
  },
  twitter: {
    username: String,
    id: String,
    token: String,
    displayName: String,
    email: String,
  },
  github: {
    email: String,
    id: String,
    displayName: String,
    token: String,
  },
});

// UserSchema.pre('save', async function () {
//   if (this.isModified('password') || this.isNew) {
//     const salt = await bcrytjs.genSalt();
//     const hash = await bcrytjs.hash(this.password, salt);
//     this.password = hash;
//   }
// });
export default mongoose.model('User', UserSchema);
