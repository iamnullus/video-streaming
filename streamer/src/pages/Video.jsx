import React from "react";
import profile from "../assets/12776d2a-368e-4586-a64e-70daa5243e54.jpg";
import Comment from "../components/Comment";
import {
  ThumbUpOutlined,
  ThumbDownOffAltOutlined,
  ReplyOutlined,
  AddTaskOutlined,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";

function Video() {
  const { id } = useParams();

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <iframe
            width="100%"
            height="640"
            src="https://www.youtube.com/embed/n7lM36yFh2Y"
            title="Samsung Galaxy S24/Ultra Impressions: More Than Meets The Eye!"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </VideoWrapper>
        <Title>My Video</Title>
        <Details>
          <Info>1,000 views • Jan 25, 2024</Info>
          <Buttons>
            <Button>
              <ThumbUpOutlined /> 123
            </Button>
            <Button>
              <ThumbDownOffAltOutlined /> Dislike
            </Button>
            <Button>
              <ReplyOutlined /> Share
            </Button>
            <Button>
              <AddTaskOutlined /> Save
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
              <Description>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Doloribus laborum delectus unde quaerat dolore culpa sit aliquam
                at. Vitae facere ipsum totam ratione exercitationem. Suscipit
                animi accusantium dolores ipsam ut.
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe>SUBSCRIBE</Subscribe>
        </Channel>
        <Hr />
        <Comment />
      </Content>
      <Recommendation>
        {/* <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" />
        <Card type="sm" /> */}
      </Recommendation>
    </Container>
  );
}

export default Video;
