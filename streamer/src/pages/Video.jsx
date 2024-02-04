import React, { useEffect, useState } from "react";
import styled from "styled-components";
import profile from "../assets/12776d2a-368e-4586-a64e-70daa5243e54.jpg";
import Comment from "../components/Comment";
import {
  ThumbUpOutlined,
  ThumbDownOffAltOutlined,
  ThumbUp,
  ThumbDown,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { baseUrl } from "../services/api/constants/endpointsConstants";
import { SendGetRequest, SendJsonPostRequest } from "../services/api";
import { Box, Typography } from "@mui/material";
import { NumberShorterner } from "../helpers/numberFormatter";
import { ShowFullDate } from "../helpers/dateFormatter";
import { ResponseMessages } from "../services/constants/responseMessages";

function Video() {
  const [video, setVideo] = useState({});
  const [isLikedVideo, setIsLikedVideo] = useState(false);
  const [isDislikedVideo, setIsDislikedVideo] = useState(false);
  const [videoNotFound, setVideoNotFound] = useState(false);
  const [addedView, setAddedView] = useState(false);

  const { id } = useParams();

  const videoUrl = `${baseUrl}/video/${id}`;

  async function GetVideoDetails() {
    const url = `${baseUrl}/video/details/${id}`;
    try {
      const { responseData } = await SendGetRequest(url);
      setVideo(responseData);
    } catch (error) {
      console.error(error);
    }
  }
  async function AddVideoView() {
    await setAddedView(true);
    let url;
    if (localStorage.getItem("token") !== undefined) {
      url = `${baseUrl}/video/view/${id}`;
    } else {
      url = `${baseUrl}/video/guest/view/${id}`;
    }

    try {
      await SendJsonPostRequest(url);
    } catch (error) {
      if (error?.message === ResponseMessages.VideoNotFound) {
        setVideoNotFound(true);
        return;
      }
      url = `${baseUrl}/video/guest/view/${id}`;
      await SendJsonPostRequest(url);
    } finally {
      GetVideoDetails();
    }
  }

  useEffect(() => {
    if (!addedView) {
      AddVideoView();
    }

    console.log(addedView);
  }, [addedView]);

  return videoNotFound ? (
    <Typography variant="h1"> Video Not Found</Typography>
  ) : (
    <Container>
      <Content>
        <VideoWrapper>
          <iframe
            width="100%"
            height="640"
            src={videoUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
        <Typography variant="h1" fontSize={24} color={"white"}>
          {video.title}
        </Typography>
        <Details>
          <Info>
            {NumberShorterner(video.viewCount)} views •{" "}
            {ShowFullDate(video.date)}
          </Info>
          <Buttons>
            <Button>
              <Box display="flex" alignItems="center" mr={1}>
                {isLikedVideo ? <ThumbUp /> : <ThumbUpOutlined />}

                <Typography color={"white"} ml={1}>
                  {NumberShorterner(video.likeCount)}
                </Typography>
              </Box>
            </Button>

            <Button>
              <Box display="flex" alignItems="center" mr={1}>
                {isDislikedVideo ? <ThumbDown /> : <ThumbDownOffAltOutlined />}

                <Typography color={"white"} ml={1}>
                  {NumberShorterner(video.dislikesCount)}
                </Typography>
              </Box>
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={profile} />
            <ChannelDetail>
              <ChannelName>Jay</ChannelName>
              <ChannelCounter>20 subscribers</ChannelCounter>
              <Description>{video.description}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe>SUBSCRIBE</Subscribe>
        </Channel>
        <Hr />
        <Comment />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: 20px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div`
  border-radius: 20px;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: #aaaaaa;
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: #ffffff;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid #373737;
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: #aaaaaa;
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

export default Video;
