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
import { NumberShorterner } from "../helpers/numberFormatter";
import { DateFormatter } from "../helpers/dateFormatter";
import { useNavigate } from "react-router-dom";

const GridVideoCard = ({ video }) => {
  const navigate = useNavigate();
  function OnClickCard() {
    navigate(`/video/${video.id}`);
  }

  return (
    <Card
      key={video.id}
      sx={{
        bgcolor: "white",
        width: 300,
        height: 240,
      }}
      onClick={OnClickCard}
    >
      <CardMedia
        component="img"
        alt="thumbnail"
        height="150"
        image={`${baseUrl}/image?imagePath=${video.thumbnail}`}
      />

      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          sx={{
            bgcolor: "inherit",
            overflow: "hidden", // Hide overflowing text
            textOverflow: "ellipsis", // Add ellipses for overflow
            whiteSpace: "nowrap", // Prevent text from wrapping
          }}
        >
          <Image
            src={`${baseUrl}/image?imagePath=${video.user.profilePicture}`}
            alt="user Profile Picture"
            width={20}
            height={20}
            sx={{ borderRadius: "50%" }}
          />
          <Typography
            variant="body2"
            component="div"
            ml={1}
            // color={"white"}
            sx={{
              overflow: "hidden", // Hide overflowing text
              textOverflow: "ellipsis", // Add ellipses for overflow
              whiteSpace: "nowrap", // Prevent text from wrapping
              width: "100%", // Ensure title takes full width
            }}
          >
            {video.title}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" sx={{ bgcolor: "inherit" }}>
          <Box display="flex" alignItems="center" mr={1}>
            <Icon color="primary" sx={{ color: "black" }} wr={0.5}>
              <ThumbUpOffAltIcon />
            </Icon>
            <Typography>{NumberShorterner(video.likeCount)}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mr={1}>
            <Icon color="primary" sx={{ color: "black" }}>
              <ThumbDownOffAltIcon />
            </Icon>
            <Typography>{NumberShorterner(video.dislikeCount)}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mr={1}>
            <Icon color="primary" sx={{ color: "black" }}>
              <OndemandVideo />
            </Icon>
            <Typography>{NumberShorterner(video.viewCount)}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mr={1}>
            <Icon color="primary" sx={{ color: "black" }}>
              <CalendarMonth />
            </Icon>
            <Typography>{DateFormatter(video.date)}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GridVideoCard;
