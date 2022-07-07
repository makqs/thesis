/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          css={css`
            background-color: #ffffff;
          `}
        >
          <Box sx={{ flexGrow: 1, flexDirection: "column" }}>
            <Typography
              component="div"
              variant="h6"
              css={css`
                color: #646c7d;
              `}
            >
              3707 Engineering (Honours) 2021
            </Typography>
            <Typography
              component="div"
              variant="subtitle2"
              css={css`
                color: #818ca1;
              `}
            >
              SENGAH3707 Software Engineering Major
            </Typography>
          </Box>
          <Box sx={{ flexDirection: "column" }}>
            <Typography
              component="div"
              variant="h6"
              css={css`
                color: #646c7d;
              `}
            >
              Sam Student
            </Typography>
            <Typography
              component="div"
              variant="subtitle2"
              css={css`
                color: #818ca1;
              `}
            >
              z5555555
            </Typography>
          </Box>
          <Button
            variant="contained"
            css={css`
              background-color: #4299e1;
              margin-left: 10px;
            `}
            onClick={onLogout}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
