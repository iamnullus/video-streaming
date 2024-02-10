import React from "react";
import styled from "styled-components";
import { baseUrl } from "../services/api/constants/endpointsConstants";

function Comment({ comment }) {
  return (
    <Container>
      <Avatar
        src={`${baseUrl}/image?imagePath=${comment.user?.profilePicture}`}
      />
      <Details>
        <Name>{comment.user.name}</Name>
        <Text>{comment.text}</Text>
      </Details>
    </Container>
  );
}

//STYLES FOR COMPONTENTS
const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #ffffff;
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #aaaaaa;
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

export default Comment;
