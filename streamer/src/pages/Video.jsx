import React, { useEffect, useRef, useState } from "react";
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
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  TextField,
} from "@mui/material";
import { NumberShorterner } from "../helpers/numberFormatter";
import { ShowFullDate } from "../helpers/dateFormatter";
import { ResponseMessages } from "../services/constants/responseMessages";

function Video() {
  const [video, setVideo] = useState({});
  const [isLikedVideo, setIsLikedVideo] = useState(false);
  const [isDislikedVideo, setIsDislikedVideo] = useState(false);
  const [videoNotFound, setVideoNotFound] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const commentInputRef = useRef();

  const { id } = useParams();

  const videoUrl = `${baseUrl}/video/${id}`;

  async function GetVideoComments() {
    const url = `${baseUrl}/video/comments/${id}`;
    try {
      const { responseData } = await SendGetRequest(url);

      setComments(responseData.comments);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetVideoDetails() {
    setIsLoading(true);

    const url = `${baseUrl}/video/details/${id}`;
    try {
      const { responseData } = await SendGetRequest(url);
      setVideo(responseData);

      GetVideoComments();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function GetLikeStatus() {
    const url = `${baseUrl}/user/video-likes-status/${id}`;
    try {
      const { responseData } = await SendGetRequest(url);

      setIsDislikedVideo(responseData.isDislike);
      setIsLikedVideo(responseData.isLiked);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    GetVideoDetails();
    if (localStorage.getItem("token")) {
      GetLikeStatus();
    }
  }, []);

  async function AddVideoView() {
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

  async function LikeVideo() {
    let url = `${baseUrl}/user/like/video/${id}`;
    try {
      await SendJsonPostRequest(url);
      setIsLikedVideo(true);
      setIsDislikedVideo(false);
    } catch (error) {
      console.error(error);
    } finally {
      GetVideoDetails();
    }
  }

  async function DislikeVideo() {
    let url = `${baseUrl}/user/dislike/video/${id}`;
    try {
      await SendJsonPostRequest(url);
      setIsLikedVideo(false);
      setIsDislikedVideo(true);
    } catch (error) {
      console.error(error);
    } finally {
      GetVideoDetails();
    }
  }

  async function UndislikeVideo() {
    let url = `${baseUrl}/user/undislike/${id}`;
    try {
      await SendJsonPostRequest(url);
      setIsDislikedVideo(false);
    } catch (error) {
      console.error(error);
    } finally {
      GetVideoDetails();
    }
  }

  async function UnLikeVideo() {
    let url = `${baseUrl}/user/unlike/${id}`;
    try {
      await SendJsonPostRequest(url);
      setIsLikedVideo(false);
    } catch (error) {
      console.error(error);
    } finally {
      GetVideoDetails();
    }
  }

  async function onClickLikeButton() {
    if (isLikedVideo) {
      UnLikeVideo();
    } else {
      LikeVideo();
    }
  }

  async function onClickDislikeButton() {
    if (isDislikedVideo) {
      UndislikeVideo();
    } else {
      DislikeVideo();
    }
  }

  async function postComment(e) {
    e.preventDefault();

    if (isLoadingComments) {
      return;
    }

    try {
      const url = `${baseUrl}/video/comment/${id}`;
      setIsLoadingComments(true);

      await SendJsonPostRequest(url, {
        comment: commentInputRef.current.value,
      });

      commentInputRef.current.value = "";
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingComments(false);

      GetVideoComments();
    }
  }

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
            allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h1" fontSize={24} color={"white"}>
              {video.title}
            </Typography>
            <Details>
              <Info>
                {NumberShorterner(video.viewCount)} views •{" "}
                {ShowFullDate(video.date)}
              </Info>
              <Stack spacing={1} direction="row">
                <Button onClick={onClickLikeButton}>
                  <Box display="flex" alignItems="center">
                    {isLikedVideo ? <ThumbUp /> : <ThumbUpOutlined />}

                    <Typography color={"white"} ml={1}>
                      {NumberShorterner(video.likeCount)}
                    </Typography>
                  </Box>
                </Button>

                <Button onClick={onClickDislikeButton}>
                  <Box display="flex" alignItems="center">
                    {isDislikedVideo ? (
                      <ThumbDown />
                    ) : (
                      <ThumbDownOffAltOutlined />
                    )}

                    <Typography color={"white"} ml={1}>
                      {NumberShorterner(video.dislikesCount)}
                    </Typography>
                  </Box>
                </Button>
              </Stack>
            </Details>
            <Hr />
            <Channel>
              <ChannelInfo>
                <Image
                  src={`${baseUrl}/image?imagePath=${video.user?.profilePicture}`}
                />
                <ChannelDetail>
                  <ChannelName>{video.user?.name}</ChannelName>
                  <ChannelCounter>{video.user?.followersCount}</ChannelCounter>
                  <Description>{video.description}</Description>
                </ChannelDetail>
              </ChannelInfo>
            </Channel>
            <Hr />
            <Typography variant="h4" color={"white"}>
              Comments
            </Typography>
            <form onSubmit={(e) => postComment(e)}>
              <Stack direction="row" spacing={2}>
                <TextField
                  id="email"
                  label="comment"
                  variant="standard"
                  inputProps={{
                    style: { borderColor: "white", color: "white" },
                  }}
                  InputLabelProps={{ style: { color: "white" } }}
                  inputRef={commentInputRef}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "ActiveBorder",
                      },
                    },
                  }}
                />
                <Button variant="contained" type="submit">
                  {isLoadingComments ? <CircularProgress /> : "Upload"}
                </Button>
              </Stack>
            </form>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id}>
                  <Comment comment={comment} />
                </div>
              ))
            ) : (
              <Typography variant="b1" color={"white"}>
                No Comment on video
              </Typography>
            )}
          </>
        )}
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
