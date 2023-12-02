import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import DeleteIcon from "@mui/icons-material/Delete";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import UserImage from "../../components/UserImage";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  loggedPicturePath,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [comment, setComment] = useState();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const [deletedPost, setDeletedPost] = useState(false);
  const isUserPost = loggedInUserId === postUserId;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const user = useSelector((state) => state.user);
  const fullName = `${user.firstName} ${user.lastName}`;

  const { _id } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const sendComment = async (id, _id, fullname, comment, loggedPicturePath) => {
    const response = await fetch(`http://localhost:3001/posts/${id}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment,
        name: fullname,
        _id: _id,
        loggedPicturePath: loggedPicturePath,
      }),
    });

    console.log("the picture path is :", loggedPicturePath);

    const updatedPost = await response.json();

    // alert("successfully set comment");
    window.location.reload(true);

    dispatch(setPost({ post: updatedPost }));
  };

  const deletePost = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    // alert("successfully deleted post");
    // window.location.reload(true);
    toast.success("Successfully deleted post", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setDeletedPost(true);
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      {!deletedPost && (
        <>
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
          />
          <Typography color={main} sx={{ mt: "1rem" }}>
            {description}
          </Typography>
          {picturePath && (
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
              src={`http://localhost:3001/assets/${picturePath}`}
            />
          )}
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <FlexBetween gap="0.3rem">
                <Tooltip title="Like post">
                  <IconButton onClick={patchLike}>
                    {isLiked ? (
                      <FavoriteOutlined sx={{ color: primary }} />
                    ) : (
                      <FavoriteBorderOutlined />
                    )}
                  </IconButton>
                </Tooltip>

                <Typography>{likeCount}</Typography>
              </FlexBetween>

              <FlexBetween gap="0.3rem">
                <Tooltip title="Comment post">
                  <IconButton onClick={() => setIsComments(!isComments)}>
                    <ChatBubbleOutlineOutlined />
                  </IconButton>
                </Tooltip>

                <Typography>{comments.length}</Typography>
              </FlexBetween>
            </FlexBetween>
            {isUserPost && (
              <Tooltip title="Delete post">
                <IconButton sx={{ marginLeft: "auto" }}>
                  <DeleteIcon onClick={deletePost} />
                </IconButton>
              </Tooltip>
            )}

            <Box sx={{ display: "flex", gap: "5px" }}>
              <Tooltip title="Share post">
                <IconButton>
                  <ShareOutlined
                    onClick={() => {
                      if (!isShare) {
                        setIsShare(true);
                      }
                      if (isShare) {
                        setIsShare(false);
                      }
                    }}
                  />
                </IconButton>
              </Tooltip>

              {isShare && (
                <>
                  <Tooltip title="facebook">
                    <IconButton>
                      <FacebookShareButton
                        url={"www.facebook.com"}
                        quote={"Facebook"}
                      >
                        <FacebookIcon sx={{ marginTop: "5px" }} />
                      </FacebookShareButton>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="twitter">
                    <IconButton>
                      <TwitterShareButton
                        url={"www.twitter.com"}
                        title={"Twitter"}
                      >
                        <TwitterIcon sx={{ marginTop: "5px" }} />
                      </TwitterShareButton>
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </FlexBetween>
          {isComments && (
            <Box mt="0.5rem">
              <Box sx={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="comment"
                  variant="standard"
                  sx={{ width: "100%" }}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  // disabled={!post}
                  // onClick={handlePost}
                  sx={{
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                    borderRadius: "3rem",
                    marginTop: "20px",
                    width: "20px",
                    height: "30px",
                  }}
                  onClick={() => {
                    if (
                      comment !== undefined &&
                      comment !== null &&
                      comment.trim().length !== 0
                    ) {
                      console.log(comment);
                      sendComment(
                        postId,
                        _id,
                        fullName,
                        comment,
                        loggedPicturePath
                      );
                    } else if (!comment) {
                      console.log("set the comment first");
                    }

                    // if (comment.trim().length !== 0) {
                    //   console.log("input value is NOT empty");
                    // } else {
                    //   console.log("input value is empty");
                    // }
                  }}
                >
                  send
                </Button>
              </Box>

              <ToastContainer />

              {comments.map((comment, i) => (
                <Box key={`${name}-${i}`}>
                  <Divider />

                  <FlexBetween gap="1rem">
                    <Box
                      sx={{ display: "flex", gap: "10px", margin: "5px" }}
                      onClick={() => {
                        navigate(`/profile/${comment.userId}`);
                        navigate(0);
                      }}
                    >
                      <UserImage
                        image={comment.posterpicturePath}
                        size="35px"
                      />
                      <Tooltip title="See Profile">
                        <Typography
                          color={main}
                          variant="h6"
                          fontWeight="500"
                          sx={{
                            "&:hover": {
                              color: palette.primary.light,
                              cursor: "pointer",
                            },
                          }}
                        >
                          {comment.userName}
                        </Typography>
                      </Tooltip>
                      <Typography
                        sx={{
                          color: main,
                          mt: "0.3rem ",
                          mb: "0.3rem",
                          pl: "1rem",
                          ml: "2rem",
                        }}
                      >
                        {comment.text}
                      </Typography>
                    </Box>
                  </FlexBetween>
                </Box>
              ))}
              <Divider />
            </Box>
          )}
        </>
      )}
      {deletedPost && (
        <>
          <Alert
            onClose={() => {
              setDeletedPost(false);
              window.location.reload(true);
            }}
          >
            Successfully deleted post!
          </Alert>
        </>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
