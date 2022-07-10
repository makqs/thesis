/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useContext } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import { UserContext } from "../helpers/UserContext";

const NavBar = ({ zId }) => {
  console.log(zId);

  const { userDispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const onLogout = () => {
    userDispatch({ type: "logout" });
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AppBar position="static">
        <Toolbar
          css={css`
            background-color: #ffffff;
          `}>
          <Box sx={{ flexGrow: 1, flexDirection: "column" }}>
            <Typography
              component="div"
              variant="h6"
              css={css`
                color: #646c7d;
              `}>
              3707 Engineering (Honours) 2021
            </Typography>
            <Typography
              component="div"
              variant="subtitle2"
              css={css`
                color: #818ca1;
              `}>
              SENGAH3707 Software Engineering Major
            </Typography>
          </Box>
          <Box sx={{ flexDirection: "column" }}>
            <Typography
              component="div"
              variant="h6"
              css={css`
                color: #646c7d;
              `}>
              Sam Student
            </Typography>
            <Typography
              component="div"
              variant="subtitle2"
              css={css`
                color: #818ca1;
              `}>
              z5555555
            </Typography>
          </Box>
          <Button
            variant="contained"
            css={css`
              background-color: #4299e1;
              margin-left: 10px;
            `}
            onClick={onLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

NavBar.propTypes = {
  zId: PropTypes.string.isRequired
};

NavBar.defaultProps = {};

export default NavBar;
