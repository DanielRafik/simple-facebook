const { error } = require("console");
const Post = require("../Models/postModel");
const joi = require("joi");
const bcrypt = require("bcryptjs");
const { response } = require("express");

class post {
  static async getAllPosts(req, res) {
    try {
      const allPosts = await Post.find().populate("user");
      res.status(200).json({ allPosts });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPostById(req, res) {
    try {
      const post_id = req.params.id;
      const post = await Post.findOne({ _id: post_id }).populate("user");
      if (!post) {
        return res.status(400).json({ message: "Post ID does not exist" });
      }
      res.status(200).json({ post });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  static async updatePost(req, res) {
    try {
      const schema = joi
        .object()
        .keys({
          title: joi.string(),
          content: joi.string(),
        })
        .required();

      const validation = schema.validate(req.body);
      if (validation.error != null) {
        res.status(400).json({ message: validation.error.details[0].message });
      }

      const post_id = req.params.id;
      const post = await Post.findOne({ _id: post_id });
      if (!post) {
        return res.status(400).json({ message: "Post ID does not exist" });
      }

      if (req.body.title) {
        post.title = req.body.title;
      }

      if (req.body.content) {
        post.content = req.body.content;
      }

      post
        .save()
        .then((response) => {
          res
            .status(200)
            .json({ message: "Post updated successfully", response });
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  static async createPost(req, res) {
    try {
      const schema = joi
        .object()
        .keys({
          title: joi.string().required(),
          content: joi.string().required(),
        })
        .required();

      const validation = schema.validate(req.body);
      if (validation.error != null) {
        res.status(400).json({ message: validation.error.details[0].message });
        return;
      }
      const userID = req.params.userID;
      const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        user: userID,
      });
      newPost
        .save()
        .then((response) => {
          res
            .status(201)
            .json({ message: "Post has been created successfully", response });
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deletePost(req, res) {
    try {
      const deletedPost = await Post.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Post has been deleted successfully!" });
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
}

module.exports = post;
