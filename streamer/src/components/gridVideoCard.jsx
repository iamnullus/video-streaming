import { CalendarMonth, Image, OndemandVideo } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Icon,
  Typography,
} from "@mui/material";
import React from "react";
import { baseUrl } from "../services/api/constants/endpointsConstants";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { formatNumber } from "../helpers/numberFormatter";
import { DateFormatter } from "../helpers/dateFormatter";
import { useNavigate } from "react-router-dom";

const GridVideoCard = ({ video }) => {
  const navigate = useNavigate();
  function OnClickCard() {
    navigate(`/video/${video.id}`);
  }

  return (
    <Card key={video.id} sx={{ bgcolor: "transparent" }} onClick={OnClickCard}>
      <CardMedia
        component="img"
        alt="thumbnail"
        height="140"
        image={`${baseUrl}/image?imagePath=${video.thumbnail}`}
      />

      <CardContent>
        <Box display="flex" alignItems="center" sx={{ bgcolor: "inherit" }}>
          <Image
            src={`${baseUrl}/image?imagePath=${video.user.profilePicture}`}
            alt="user Profile Picture"
            width={20}
            height={20}
            sx={{ borderRadius: "50%" }}
          />
          <Typography variant="body2" component="div" ml={1} color={"white"}>
            {video.title}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" sx={{ bgcolor: "inherit" }}>
          <Box display="flex" alignItems="center" mr={1}>
            <Icon color="primary" sx={{ color: "white" }} wr={0.5}>
              <ThumbUpOffAltIcon />
            </Icon>
            <Typography color={"white"}>
              {formatNumber(video.likeCount)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mr={1}>
            <Icon color="primary" sx={{ color: "white" }}>
              <ThumbDownOffAltIcon />
            </Icon>
            <Typography color={"white"}>
              {formatNumber(video.dislikeCount)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mr={1}>
            <Icon color="primary" sx={{ color: "white" }}>
              <OndemandVideo />
            </Icon>
            <Typography color={"white"}>
              {formatNumber(video.viewCount)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mr={1}>
            <Icon color="primary" sx={{ color: "white" }}>
              <CalendarMonth />
            </Icon>
            <Typography color={"white"}>{DateFormatter(video.date)}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GridVideoCard;
