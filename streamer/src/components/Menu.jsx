import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logoImage from "../assets/stream.png";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

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
      <LogoWrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Image src={logoImage} />
            STREAMER
          </Logo>
        </Link>
      </LogoWrapper>
      <NavWrapper>
        <NavItem to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Home
        </NavItem>
        <NavItem
          to="/library"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Library
        </NavItem>
        {localStorage.getItem("token") === null ? (
          <NavItem
            to="login"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button variant="contained" color="primary">
              Sign in
            </Button>
          </NavItem>
        ) : (
          <>
            <NavItem
              to="/upload"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Upload
            </NavItem>
            <Button
              variant="contained"
              color="secondary"
              onClick={onClickLogOut}
            >
              Log out
            </Button>
          </>
        )}
      </NavWrapper>
    </Container>
  );
}

// STYLES FOR COMPONENTS
const Container = styled(Box)`
  background-color: #1a1a1a;
  color: white;
  font-size: 14px;
  width: 200px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
`;

const LogoWrapper = styled.div`
  padding: 18px 12px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const NavWrapper = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  padding: 7.5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3d3d3d;
  }
`;

export default Menu;
