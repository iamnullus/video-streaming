import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { Menu } from "./components";
import { Home, Login, Signup, Video } from "./pages";
import Library from "./pages/Library";
import UploadVideoPage from "./pages/Upload";
import UserPage from "./pages/User";
import Box from "@mui/system"; // Import Box for layout

const Main = styled.div`
  flex: 7;
  background-color: #0f0f0f;
`;
const Container = styled.div`
  display: flex;
  padding: 0px;
  margin: 0px;
`;
const Wrapper = styled.div`
  padding: 22px 40px;
`;

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Menu />
        <Main sx={{ overflowY: "auto" }}>
          <Wrapper>
            <Routes>
              <Route path="/" />
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="library" element={<Library />} />
              <Route path="upload" element={<UploadVideoPage />} />
              <Route path="video">
                <Route path=":id" element={<Video />} />
              </Route>
              <Route path="user">
                <Route path=":id" element={<UserPage />} />
              </Route>
            </Routes>
          </Wrapper>
        </Main>
      </BrowserRouter>
    </Container>
  );
}

export default App;
