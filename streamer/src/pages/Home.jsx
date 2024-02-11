import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { baseUrl } from "../services/api/constants/endpointsConstants";
import { SendGetRequest } from "../services/api";
import { CircularProgress } from "@mui/material";
import GridVideoCard from "../components/gridVideoCard";

function Home() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 1;

  useEffect(() => {
    async function fetchVideosPaginatedVideos() {
      setIsLoading(true);

      const url = `${baseUrl}/video/get/paginated?page=${page}&pageSize=${pageSize}`;

      try {
        const { responseData } = await SendGetRequest(url);

        if (!responseData.videos.length) {
          return;
        }

        setVideos([...videos, ...responseData.videos]);
        setPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchVideosPaginatedVideos();
        }
      },
      { threshold: 1 }
    );

    observer.observe(document.getElementById("intersectionObserverTarget"));

    // Cleanup the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [page, videos]);

  return (
    <Container>
      {videos.map((v) => (
        <VideoCardWrapper key={v.id}>
          <GridVideoCard video={v} />
        </VideoCardWrapper>
      ))}

      <div id="intersectionObserverTarget" style={{ height: "20px" }} />
      {isLoading && <CircularProgress />}
    </Container>
  );
}

//STYLES FOR COMPONENTS
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
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

export default Home;
