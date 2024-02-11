import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { baseUrl } from "../services/api/constants/endpointsConstants";
import { SendFormDataPostRequest } from "../services/api";

const UploadVideoPage = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoName, setVideoName] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setVideoName(file ? file.name : "");
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setThumbnailName(file ? file.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const url = `${baseUrl}/video/upload`;

      const formData = new FormData();

      formData.append("video", video);
      formData.append("thumbnail", thumbnail);
      formData.append("title", title);
      formData.append("description", description);

      const { responseData } = await SendFormDataPostRequest(url, formData);

      setVideo(null);
      setThumbnail(null);
      setTitle("");
      setDescription("");
      setThumbnailName("");
      setVideoName("");
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ color: "white" }}
      >
        Upload Video
      </Typography>
      <form onSubmit={handleSubmit}>
        <label htmlFor="video-upload">
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={handleVideoChange}
          />
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            style={{ color: "white", marginBottom: "10px" }}
          >
            Upload Video
          </Button>
          <Typography
            variant="body1"
            style={{ color: "white", marginLeft: "10px" }}
          >
            {videoName}
          </Typography>
        </label>
        <br />
        <label htmlFor="thumbnail-upload">
          <input
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleThumbnailChange}
          />
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            style={{ color: "white", marginBottom: "10px" }}
          >
            Upload Thumbnail
          </Button>
          <Typography
            variant="body1"
            style={{ color: "white", marginLeft: "10px" }}
          >
            {thumbnailName}
          </Typography>
        </label>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, style: { color: "white" } }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ color: "white" }}
          inputProps={{ style: { borderColor: "white", color: "white" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "ActiveBorder",
              },
            },
            marginBottom: "20px",
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, style: { color: "white" } }}
          multiline
          rows={8}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ color: "white" }}
          inputProps={{ style: { borderColor: "white", color: "white" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "ActiveBorder",
              },
            },
            marginBottom: "20px",
          }}
        />
        {error && <Typography>Error while uploading the video</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isLoading ? <CircularProgress /> : "Upload"}
        </Button>
      </form>
    </Container>
  );
};

export default UploadVideoPage;
