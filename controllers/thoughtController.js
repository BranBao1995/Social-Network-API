const Thought = require("../models/Thought");
const User = require("../models/User");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought) {
        res.status(404).json({ message: "No user with that ID" });
      } else {
        res.status(200).json(thought);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);
      const dbUserData = await User.findOneAndUpdate(
        { username: dbThoughtData.username },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
      res.status(200).json({ dbThoughtData, dbUserData });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);

      const oldThoughtOwner = await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: thought._id } },
        { new: true }
      );
      const dbThoughtData = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true, runValidators: true }
      );
      const newThoughtOwner = await User.findOneAndUpdate(
        { username: dbThoughtData.username },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
      res.status(200).json({
        dbThoughtData,
        oldThoughtOwner,
        newThoughtOwner,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a thought
  async deleteThought(req, res) {
    try {
      const dbThoughtData = await Thought.findByIdAndDelete(
        req.params.thoughtId
      );
      const oldThoughtOwner = await User.findOneAndUpdate(
        { username: dbThoughtData.username },
        { $pull: { thoughts: dbThoughtData._id } },
        { new: true }
      );
      res.status(200).json({ dbThoughtData, oldThoughtOwner });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add a reaction
  async addReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        {
          $push: { reactions: req.body },
        },
        { new: true }
      );
      res.status(200).json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a reaction
  async deleteReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        {
          $pull: {
            reactions: {
              $elemMatch: { reactionId: { $match: req.body.reactionId } },
            },
          },
        },
        { new: true }
      );
      res.status(200).json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
