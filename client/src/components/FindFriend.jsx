import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const FindFriend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const loggedInUserId = useSelector((state) => state.user._id);

  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);
  // console.log(isFriend);

  const isUserProfile = loggedInUserId === friendId;

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <>
      {!isUserProfile && (
        <FlexBetween
          sx={{
            backgroundColor: "white",
            height: "120px",
            borderRadius: "10px",
            width: "400px",
            padding: "15px",
            boxShadow: "0 0 5px rgba(0,0,0,0.3)",
            transition: "0.3s ease-in",

            "&:hover": {
              transform: "scale(1.05)",
              transition: "0.3s ease-out",
            },
          }}
        >
          <FlexBetween gap="1rem">
            <UserImage image={userPicturePath} size="55px" />
            <Box
              onClick={() => {
                navigate(`/profile/${friendId}`);
                navigate(0);
              }}
            >
              <Tooltip title="See Profile">
                <Typography
                  color="black"
                  variant="h4"
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: { main },
                      cursor: "pointer",
                    },
                    whiteSpace: "nowrap",
                  }}
                >
                  {name}
                </Typography>
              </Tooltip>
              <Typography color={medium} fontSize="0.75rem">
                {subtitle}
              </Typography>
            </Box>
          </FlexBetween>

          <IconButton
            onClick={() => patchFriend()}
            sx={{
              backgroundColor: primaryLight,
              p: "0.6rem",
            }}
          >
            {isFriend ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
        </FlexBetween>
      )}
    </>
  );
};

export default FindFriend;
