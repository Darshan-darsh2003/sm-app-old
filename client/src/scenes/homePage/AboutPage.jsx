import { Box, Typography } from "@mui/material";

import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();
  const mode = useSelector((state) => state.mode);
  return (
    <>
      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "50px",
          //   marginRight: "20px",
        }}
      >
        {/* <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          sx={{
            "&:hover": {
              color: "black",
              cursor: "pointer",
            },
          }}
        >
          InterActo
        </Typography> */}
        <Typography
          onClick={() => navigate("/home")}
          fontWeight="bold"
          variant="h1"
          color={mode === "light" ? "black" : "white"}
          sx={{
            "&:hover": {
              //   color: "black",
              cursor: "pointer",
            },
            marginRight: "auto",
            alignSelf: "center",
          }}
        >
          About InterActo
        </Typography>
      </Box>
      <Box
        sx={{
          borderRadius: "15px",
          margin: "20px 20px 10px 20px",
          padding: "20px 30px 10px 30px",
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          // background: "white",
        }}
      >
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          Welcome to Interacto, the ultimate social media app that connects you
          with friends, allows you to express yourself creatively, and fosters
          meaningful interactions in a vibrant community. Powered by the MERN
          (MongoDB, Express, React, Node.js) stack, Interacto delivers a
          seamless and engaging user experience that will revolutionize the way
          you connect and share with others.
        </Typography>
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          Registering with Interacto is quick and easy. Simply create an account
          by providing your basic information, including your name, email
          address, and a unique username. We prioritize the security and privacy
          of your data, employing advanced encryption protocols to ensure that
          your personal information is always protected.
        </Typography>
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          Once you've registered, logging in and out of Interacto is a breeze.
          With just a few clicks, you can access your personalized profile and
          start connecting with friends. The login process is secure and can be
          completed using your username and password combination or by utilizing
          your integrated social media accounts for added convenience.
        </Typography>
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          Interacto is all about building connections, and adding friends is a
          fundamental feature of the platform. Seamlessly search for other users
          by their usernames, explore suggested contacts, or import your
          existing contacts from your phone's address book. By expanding your
          network, you can stay connected with friends, discover new like-minded
          individuals, and explore exciting new connections.
        </Typography>
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          Your profile is your personal canvas on Interacto. Showcase your
          personality by uploading a profile picture, updating your status, and
          providing a brief bio that reflects your interests and passions. In
          addition to personalizing your own profile, you can also explore the
          profiles of other users, gaining insight into their activities,
          interests, and shared content.
        </Typography>
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          Sharing your life's moments and experiences has never been easier.
          Interacto enables you to post images accompanied by captions, allowing
          you to express yourself creatively and share your adventures with
          friends and followers. With our intuitive image editing tools, you can
          enhance your photos with filters, effects, and stickers, ensuring that
          each post stands out and captivates your audience.
        </Typography>
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          Engagement is at the heart of Interacto. You can interact with others'
          posts by liking and commenting, fostering a sense of appreciation and
          enabling meaningful conversations. These interactions not only
          strengthen existing connections but also provide opportunities to
          build new friendships and connections that transcend digital
          boundaries.
        </Typography>
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          Managing your content is a breeze with Interacto's versatile features.
          You have complete control over your posts, with the option to delete
          any that no longer align with your preferences or reflect your current
          self. This ensures that your feed remains clutter-free and tailored to
          your unique tastes, promoting a seamless browsing experience.
        </Typography>
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          To enhance your user experience, Interacto offers a customizable theme
          with both dark and light modes. Whether you prefer a sleek and modern
          look or a softer, gentler aesthetic, Interacto adapts to your
          preferences, ensuring a visually pleasing experience in any lighting
          condition.
        </Typography>
        <Typography variant="h5" color={mode === "light" ? "black" : "white"}>
          In conclusion, Interacto is the ultimate social media app that
          empowers you to connect, share, and engage in a vibrant community.
          With features like user registration, secure login and logout, friend
          connections, comprehensive profile views, image sharing with captions,
          liking and commenting on posts, post deletion, and customizable dark
          and light modes, Interacto is set to redefine social networking as we
          know it. Join the Interacto community today and discover a new world
          of social media possibilities.
        </Typography>
      </Box>
    </>
  );
};

export default AboutPage;
