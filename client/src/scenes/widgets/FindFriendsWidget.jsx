import { Box, Typography } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state";
import ProfileFriend from "../../components/ProfileFriend";
import React from "react";

const FindFriendsWidget = ({ userId }) => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper sx={{ marginLeft: "80px" }}>
      <Typography
        //   onClick={() => navigate("/home")}
        fontWeight="bold"
        variant="h4"
        //   color={mode === "light" ? "black" : "white"}
        sx={{
          "&:hover": {
            //   color: "black",
            cursor: "pointer",
          },
          marginRight: "auto",
          alignSelf: "center",
          marginBottom: "20px",
        }}
      >
        Your Friends
      </Typography>

      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <ProfileFriend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
            profileUserId={userId}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FindFriendsWidget;
