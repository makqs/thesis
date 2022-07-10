/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

const NavBar = ({ zId, isStaff }) => {
  console.log(zId, isStaff);

  const navigate = useNavigate();

  const onLogout = () => {
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
  zId: PropTypes.string.isRequired,
  isStaff: PropTypes.bool
};

NavBar.defaultProps = {
  isStaff: false
};

export default NavBar;
