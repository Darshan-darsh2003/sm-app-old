import { Box } from "@mui/material";
import React from "react";

const SearchResult = ({ result }) => {
  return (
    <Box
      sx={{
        padding: "10px 20px",
        "&:hover": {
          backgroundColor: "#efefef",
        },
      }}
      onClick={(e) => alert(`You selected ${result}!`)}
    >
      {result}
    </Box>
  );
};

export default SearchResult;
