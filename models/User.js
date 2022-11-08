const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (enteredEmail) {
          const regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return regex.test(enteredEmail);
        },
        message: "Invalid Email Input.",
      },
    },
    thoughts: [{ type: mongoose.Schema.ObjectId, ref: "thought" }],
    friends: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: true,
  }
);

postSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = mongoose.model("user", userSchema);

module.exports = User;
