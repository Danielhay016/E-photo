/*
The code defines a Mongoose schema and model for storing user information within an application. 
This schema outlines the structure and attributes of a user document that will be stored in a MongoDB database.
*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
   name: {
      type: String,
      required: "Name is required",
    },
    email: {
      type: String,
      require: "Email is required",
      unique: true,
    },
    password: {
      type: String,
      required: "Password is required",
    },
    description: {
      type: String,
      default: "Passionate traveler and explorer, capturing moments from around the world through my lens",
    },
    
    location: {     
      type: String,    
      default: "Tel Aviv",
      },
      
     date: {
       type: Date,
       default: Date.now,
     },
     
    isManager: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
