import React from "react";
import { Box, Typography, Tooltip, Divider } from "@mui/material";
import UserImage from "./UserImage";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useTheme } from "@emotion/react";

const SearchResultsList = ({ results }) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const navigate = useNavigate();
  const mode = useSelector((state) => state.mode);

  return (
    <Box
      sx={{
        // width: "100%",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        boxShadow:
          mode === "light" ? "0px 0px 10px #F3F3F3" : "0px 0px 10px #333333",
        borderRadius: "10px",
        marginTop: "1rem",
        maxHeight: "300px",
        overflowY: "auto",
        position: "fixed",
        zIndex: "1",
        top: "50px",
        left: "300px",
        width: "300px",
        gap: "5px",
        "::-webkit-scrollbar": {
          display: "none",
        },
        backgroundColor: mode === "light" ? "#F3F3F3" : "#333333",
      }}
    >
      {results.map((result, id) => {
        let name = result.firstName + " " + result.lastName;
        return (
          <>
            <Divider />
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                margin: "5px",
                backgroundColor: mode === "light" ? "white" : "#333333",

                padding: "10px",
                borderRadius: "10px",
              }}
              onClick={() => {
                navigate(`/profile/${result._id}`);
                navigate(0);
              }}
            >
              <UserImage image={result.picturePath} size="35px" />
              <Tooltip title="See Profile">
                {}
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
                  {name}
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
                {result.occupation}
              </Typography>
            </Box>
          </>
        );
      })}
    </Box>
  );
};

export default SearchResultsList;
