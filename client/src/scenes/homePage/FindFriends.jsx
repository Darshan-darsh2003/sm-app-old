import React from "react";
import { useSelector } from "react-redux";
import FindFriend from "../../components/FindFriend";
import { Box, Typography, Button } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";
import FindFriendsWidget from "../widgets/FindFriendsWidget";

const FindFriends = () => {
  const navigate = useNavigate();
  const users = useSelector((state) => state.users);

  const loggedInUserId = useSelector((state) => state.user._id);

  console.log(users);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Box
        sx={{ width: "100%", margin: "20px", display: "flex", gap: "400px" }}
      >
        <Button
          onClick={() => navigate("/home")}
          sx={{ marginLeft: "20px" }}
          variant="contained"
          startIcon={<HomeOutlinedIcon />}
        >
          HOME
        </Button>

        <Typography
          //   onClick={() => navigate("/home")}
          fontWeight="bold"
          variant="h1"
          //   color={mode === "light" ? "black" : "white"}
          sx={{
            "&:hover": {
              //   color: "black",
              //   cursor: "pointer",
            },
            marginRight: "auto",
            alignSelf: "center",
          }}
        >
          Find New Friends
        </Typography>
      </Box>
      <Box
        sx={{
          width: "70%",
          display: "flex",
          flexDirection: "row",
          gap: "80px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "50px",
          }}
        >
          {users.map(
            ({
              _id,
              firstName,
              lastName,

              occupation,
              picturePath,
            }) => (
              <>
                <FindFriend
                  key={_id}
                  friendId={_id}
                  name={`${firstName} ${lastName}`}
                  subtitle={occupation}
                  userPicturePath={picturePath}
                />
              </>
            )
          )}
        </Box>
        <Box
          sx={{
            position: "fixed",
            top: "30px",
            right: "30px",
            overflowY: "scroll",
          }}
        >
          <FindFriendsWidget userId={loggedInUserId} />
        </Box>
      </Box>
    </Box>
  );
};

export default FindFriends;
