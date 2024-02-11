import { Home } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logoImage from "../assets/stream.png";

function Menu() {
  const navigate = useNavigate();

  async function onClickLogOut(e) {
    e.preventDefault();

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Image src={logoImage} />
            STREAMER
          </Logo>
        </Link>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>Home</Item>
        </Link>
        <Link
          to="/library"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>Library</Item>
        </Link>

        {localStorage.getItem("token") === null ? (
          <Link to="login" style={{ textDecoration: "none", color: "inherit" }}>
            <Button>Sign in</Button>
          </Link>
        ) : (
          <>
            <Link
              to="/upload"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>Upload</Item>
            </Link>
            <Button
              onClick={(e) => {
                onClickLogOut(e);
              }}
            >
              Log out
            </Button>
          </>
        )}
      </Wrapper>
    </Container>
  );
}

// STYLES FOR COMPONENTS
const Container = styled.div`
  background-color: #0f0f0f;
  color: white;
  font-size: 14px;
  top: 0;
  height: 100vh;
`;

const Wrapper = styled.div`
  padding: 18px 12px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 10px;

  &:hover {
    background-color: #3d3d3d;
  }
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
`;

export default Menu;
