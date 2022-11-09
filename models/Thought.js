const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  reactionId: {
    type: mongoose.Schema.ObjectId,
    default: mongoose.Types.ObjectId(),
  },

  reactionBody: {
    type: String,
    required: true,
    maxLength: 280,
  },

  username: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    // get: function () {
    //   return `${Date(this.default).getMonth() + 1}/${Date(
    //     this.default
    //   ).getDate()}/${Date(this.default).getFullYear()}`;
    // },
  },
});

const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
    createdAt: {
      type: Date,
      default: Date.now,
      // get: function () {
      //   return `${Date(this.default).getMonth() + 1}/${Date(
      //     this.default
      //   ).getDate()}/${Date(this.default).getFullYear()}`;
      // },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: true,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = mongoose.model("thought", thoughtSchema);

module.exports = Thought;
