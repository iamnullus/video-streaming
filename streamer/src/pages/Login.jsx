import React, { useRef, useState } from "react";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { SendJsonPostRequest } from "../services/api/index.js";
import { baseUrl } from "../services/api/constants/endpointsConstants.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  async function HandleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (email === "" || password === "") {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setErrorMessage("");

    const url = `${baseUrl}/auth/login`;
    const body = { email, password };

    try {
      const { responseData } = await SendJsonPostRequest(url, body);

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("userId", responseData.userId);

      navigate("/");
    } catch (error) {
      console.error(error);

      const errorMessage = error.message || "internal error";

      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh",
      }}
    >
      <form
        onSubmit={(e) => HandleLogin(e)}
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: 24, color: "white", marginBottom: "20px" }}
        >
          Welcome back to Streamer
        </Typography>

        {errorMessage !== null && (
          <Typography
            variant="body2"
            sx={{ color: "red", marginBottom: "20px" }}
          >
            {errorMessage}
          </Typography>
        )}

        <TextField
          id="email"
          label="Email"
          variant="standard"
          inputProps={{ style: { borderColor: "white", color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
          inputRef={emailRef}
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
            marginBottom: "20px",
          }}
        />

        <TextField
          id="password"
          label="Password"
          variant="standard"
          inputProps={{ style: { borderColor: "white", color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
          inputRef={passwordRef}
          type="password"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "ActiveBorder",
              },
            },
            marginBottom: "20px",
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          fullWidth
          sx={{
            "&:hover": {
              backgroundColor: "rgb(33, 150, 243)",
            },
            "&:hover fieldset": {
              borderColor: "ActiveBorder",
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        <Button href="/signup" style={{ color: "white", marginTop: "10px" }}>
          Don't have an account? Sign up
        </Button>
      </form>
    </div>
  );
};

export default Login;
