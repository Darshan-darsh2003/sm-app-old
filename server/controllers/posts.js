import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
    console.log("error in getting feed posts");
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
    console.log("error in getting user posts");
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  // console.log(id);
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    console.log("id of user:", userId);
    console.log("id of post: ", id);
    console.log("inside node js deletepost logic");

    ////ERROR TO BE SOLVED ,NOT DELETING POST

    const updatedPost = await Post.deleteOne({ _id: id });
    console.log("successfully deleted the post");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, _id, name, loggedPicturePath } = req.body;
    const post = await Post.findById(id);

    console.log("the post _id is :", _id);
    console.log("the post commenter id is :", id);
    console.log("the post comment is :", comment);
    console.log("the commenter name is :", name);
    console.log("the path of poster image is :", loggedPicturePath);

    const filter = { _id: id }; // Replace with the ID of the document to update
    const update = {
      $addToSet: {
        comments: {
          userName: name,
          text: comment,
          userId: _id,
          posterpicturePath: loggedPicturePath,
        },
      },
    }; // Replace with your array field and the value to add

    const updatedPost = await Post.updateOne(filter, update);

    console.log(`${updatedPost.matchedCount} document(s) matched the filter.`);
    console.log(`${updatedPost.modifiedCount} document(s) was/were updated.`);

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating document:", err);
    res.status(404).json({ message: err.message });
  }
};
