const { error } = require("console");
const User = require("../Models/userModel");
const joi = require("joi");
const bcrypt = require("bcryptjs");
const { counter } = require("../metrics");

// console.log(counter)
class user {
  static async getAllUsers(req, res) {
    try {
      const allUsers = await User.find();
      counter.labels({ method: "GET", path: "/user/all" }).inc();
      res.status(200).json({ allUsers });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  static async getUserById(req, res) {
    try {
      const user_id = req.params.id;

      const user = await User.findOne({ _id: user_id });
      if (!user) {
        return res.status(400).json({ message: "User ID does not exist" });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  static async createUser(req, res) {
    try {
      const schema = joi
        .object()
        .keys({
          name: joi.string().required(),
          email: joi.string().required(),
          phone: joi.number().required(),
          password: joi.string().required(),
        })
        .required();

      const validation = schema.validate(req.body);
      if (validation.error != null) {
        res.status(400).json({ message: validation.error.details[0].message });
        return;
      }
      const salt = bcrypt.genSaltSync(10);

      const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
      console.log(hashedPassword);
      const newUser = new User({
        name: req.body.name,
        password: hashedPassword,
        phone: req.body.phone,
        email: req.body.email,
      });

      newUser
        .save()
        .then((response) => {
          res
            .status(201)
            .json({ message: "User has been created successfully", response });
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const schema = joi
        .object()
        .keys({
          name: joi.string(),
          email: joi.string(),
          password: joi.string(),
          phone: joi.number(),
        })
        .required();

      const validation = schema.validate(req.body);
      if (validation.error != null) {
        res.status(400).json({ message: validation.error.details[0].message });
      }

      const user_id = req.params.id;
      const user = await User.findOne({ _id: user_id });
      if (!user) {
        return res.status(400).json({ message: "User ID does not exist" });
      }

      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
        console.log(hashedPassword);
        user.password = req.body.password;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.phone) {
        user.phone = req.body.phone;
      }
      user
        .save()
        .then((response) => {
          res
            .status(200)
            .json({ message: "User updated successfully", response });
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const deletedUser = await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "User has been deleted successfully!" });
    } catch (error) {
      res.status(400).json({ messages: error.message });
    }
  }
}
module.exports = user;
