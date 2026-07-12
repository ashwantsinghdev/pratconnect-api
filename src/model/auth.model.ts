import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new Schema({
  image: {
    type: String,
    default: null,
  },
  fullname: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  refreshToken: {
    type: String,
  },
  expiry: {
    type: Date,
  },

},{timestamps:true});

authSchema.pre("save",async function(){
    this.password=await bcrypt.hash(this.password.toString(),12)


})

authSchema.pre("save",function(){
    if (this.isNew) {
      this.refreshToken = null;
      this.expiry = null;
    }
})

const AuthModel=model("Auth",authSchema)

export default AuthModel
