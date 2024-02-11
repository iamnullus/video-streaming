import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Link, Typography } from "@mui/material";
import styled from "styled-components";
import GridVideoCard from "../components/gridVideoCard";
import { SendGetRequest } from "../services/api";
import { baseUrl } from "../services/api/constants/endpointsConstants";

const Library = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const isLoggedIn = localStorage.getItem("token") !== null;

  async function fetchUserVideos() {
    setIsLoading(true);

    const url = `${baseUrl}/video/get/user/viewed`;

    try {
      const { responseData } = await SendGetRequest(url);

      setVideos([...videos, ...responseData.videos]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUserVideos();
    }
  }, []);

  return isLoggedIn ? (
    <>
      <Typography variant="h5" color={"white"} mb={5}>
        Latest Viewed videos
      </Typography>
      <Container>
        {videos.map((v) => (
          <VideoCardWrapper key={v.id}>
            <GridVideoCard video={v} />
          </VideoCardWrapper>
        ))}

        {isLoading && <CircularProgress />}
      </Container>
    </>
  ) : (
    <CenteredContent>
      <Typography variant="h5" color={"white"}>
        Login to view your library
      </Typography>
      <Button variant="contained" color="primary" href="/login">
        Login
      </Button>
    </CenteredContent>
  );
};

// STYLES FOR COMPONENTS
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const VideoCardWrapper = styled.div`
  flex-basis: calc(20% - 20px);
  margin-bottom: 20px;
  margin-right: 20px;

  @media screen and (max-width: 1024px) {
    flex-basis: calc(33.33% - 20px);
  }

  @media screen and (max-width: 600px) {
    flex-basis: calc(100% - 20px);
  }
`;

export default Library;
