import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../services/api/constants/endpointsConstants";
import { SendGetRequest, SendJsonPostRequest } from "../services/api";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import styled from "styled-components";
import GridVideoCard from "../components/gridVideoCard";

const UserPage = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userVideos, setUserVideos] = useState([]);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);

  const { id } = useParams();

  async function OnClickFollowButton() {
    setIsLoadingFollowing(true);

    let url;
    if (followStatus) {
      url = `${baseUrl}/user/unfollow/${id}`;
    } else {
      url = `${baseUrl}/user/follow/${id}`;
    }

    try {
      const { responseData } = await SendJsonPostRequest(url);

      GetUser();
      GetUserFollowingStatus();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingFollowing(false);
    }
  }

  async function GetUserFollowingStatus() {
    const url = `${baseUrl}/user/followStatus/${id}`;
    try {
      const { responseData } = await SendGetRequest(url);

      setFollowStatus(responseData.isFollow);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetUser() {
    const url = `${baseUrl}/user/details/${id}`;
    try {
      setIsLoading(true);
      const { responseData } = await SendGetRequest(url);

      setUser(responseData.user);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetUserVideos() {
    const url = `${baseUrl}/video/user/${id}`;
    try {
      setIsVideoLoading(true);
      const { responseData } = await SendGetRequest(url);

      setUserVideos(responseData.videos);
      setIsVideoLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    GetUser();
    GetUserVideos();
    GetUserFollowingStatus();
  }, []);

  return (
    <>
      <Container>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <ProfileSection>
            <Image src={`${baseUrl}/image?imagePath=${user?.profilePicture}`} />
            <div>
              <Typography variant="h3" color={"white"}>
                {user?.name}
              </Typography>
              <Typography variant="b1" color={"white"}>
                {user?.followersCount} followers
              </Typography>
              {localStorage.getItem("token") !== null && (
                <div style={{ marginTop: "10px" }}>
                  <Button variant="contained" onClick={OnClickFollowButton}>
                    {isLoadingFollowing ? (
                      <CircularProgress />
                    ) : followStatus ? (
                      "Unfollow"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </ProfileSection>
        )}
      </Container>
      <Typography variant="h5" mt={10} color={"white"}>
        VIDEO
      </Typography>
      {isVideoLoading ? (
        <CircularProgress />
      ) : (
        <>
          {userVideos.length ? (
            <VideoContainer>
              {userVideos.map((v) => (
                <VideoCardWrapper key={v.id}>
                  <GridVideoCard video={v} />
                </VideoCardWrapper>
              ))}
            </VideoContainer>
          ) : (
            <Typography variant="h6" mt={2} color="white">
              No videos found.
            </Typography>
          )}
        </>
      )}
    </>
  );
};

//STYLES FOR COMPONENTS
const VideoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
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

export default UserPage;
