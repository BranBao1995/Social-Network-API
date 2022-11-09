const User = require("../models/User");
const Thought = require("../models/Thought");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      if (!user) {
        res.status(404).json({ message: "No user with that ID" });
      } else {
        res.status(200).json(user);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.status(200).json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a user
  async updateUser(req, res) {
    try {
      const dbUserData = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(200).json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a user
  async deleteUser(req, res) {
    try {
      const dbUserData = await User.findByIdAndDelete(req.params.userId);
      // also delete all associated thoughts by this user.
      const deletedThought = await Thought.deleteMany({
        username: dbUserData.username,
      });
      res.status(200).json({ dbUserData, deletedThought });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add a friend
  async addFriend(req, res) {
    try {
      const dbUserData = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $push: { friends: req.params.friendId },
        },
        { new: true }
      );
      res.status(200).json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a friend
  async deleteFriend(req, res) {
    try {
      const dbUserData = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $pull: { friends: req.params.friendId },
        },
        { new: true }
      );
      res.status(200).json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
