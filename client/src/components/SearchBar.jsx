import React from "react";
import { Search } from "@mui/icons-material";
import { Box, IconButton, InputBase } from "@mui/material";
import { useSelector } from "react-redux";
import { setUsers } from "../state";
import { useDispatch } from "react-redux";
import { useState } from "react";

const SearchBar = ({ setResults }) => {
  const token = useSelector((state) => state.token);

  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const users = useSelector((state) => state.users);
  const mode = useSelector((state) => state.mode);

  const getAllUsers = async () => {
    console.log("clicked on getallusers");
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("get users data", data);

      if (response.status === 203) {
        dispatch(setUsers({ users: data }));
      }

      // dispatch(data);
    } catch (error) {
      console.log("error in getting users from client");
    }
  };

  const fetchData = (value) => {
    const results = users.filter((user) => {
      let name = `${user.firstName}+${user.lastName}`;
      return value && user && name && name.toLowerCase().includes(value);
    });
    setResults(results);
  };

  const handleChange = (value) => {
    setInput(value);
    console.log("handle change value:", value);
    fetchData(value);
  };

  return (
    <Box
      sx={{
        // width: " 100%",

        height: "2.5rem",
        border: " none",
        borderRadius: "10px",
        padding: "0 15px",
        boxShadow: mode === "light" ? "white" : "#000",
        // backgroundColor: "#F3F3F3",
        backgroundColor: mode === "light" ? "#F3F3F3" : "#333333",

        display: "flex",
        alignItems: "center",
        position: "fixed",
        zIndex: "1",
        top: "20px",
        left: "300px",
        width: "300px",
      }}
    >
      <InputBase
        sx={{
          backgroundColor: mode === "light" ? "#F3F3F3" : "#333333",
          border:
            mode === "light" ? "10px solid #F3F3F3" : "10px solid #333333",
          height: "100%",
          fontSize: "1.25rem",
          width: "100%",
          marginLeft: "5px",
          color: mode === "light" ? "black" : "white",
          "&:focus": {
            outline: "none",
          },
        }}
        placeholder="Search..."
        value={input}
        onClick={getAllUsers}
        onChange={(e) => handleChange(e.target.value)}
      />
      <IconButton
        sx={{
          color: mode === "light" ? "black" : "white",
        }}
      >
        <Search />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
