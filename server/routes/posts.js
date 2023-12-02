import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  deletePost,
  commentPost,
  likePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/*DELETE*/
router.delete("/:id/delete", verifyToken, deletePost);

// SET COMMENTS (UPDATE)
router.patch("/:id/comment", verifyToken, commentPost);

export default router;
