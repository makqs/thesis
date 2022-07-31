/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useContext, useEffect } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

// import PropTypes from "prop-types";

import { UserContext } from "../helpers/UserContext";
import { fetchWrapper } from "../helpers/Wrapper";

const NavBar = () => {
  const { userState, userDispatch } = useContext(UserContext);

  const [zId, setZId] = useState("");
  const [name, setName] = useState("");

  const [program, setProgram] = useState(null);
  const [stream, setStream] = useState(null);

  const navigate = useNavigate();

  const onLogout = () => {
    userDispatch({ type: "logout" });
    navigate("/login");
  };

  const getProgram = async (id) => {
    const programData = await fetchWrapper("POST", "/user/program", null, { zid: id });
    setProgram(programData);
  };

  const getStream = async (id) => {
    const streamData = await fetchWrapper("POST", "/user/stream", null, { zid: id });
    setStream(streamData);
  };

  useEffect(() => {
    setZId(userState.zId);
    setName(userState.name);
    getProgram(userState.zId);
    getStream(userState.zId);
  }, [userState]);

  return (
    <Box
      css={css`
        flex-grow: 0;
      `}>
      <AppBar position="static">
        <Toolbar
          css={css`
            background-color: #ffffff;
          `}>
          <Box
            css={css`
              flex-grow: 1;
              flex-direction: column;
            `}>
            <Typography
              component="div"
              variant="h6"
              css={css`
                color: #646c7d;
              `}>
              {program ? `${program.code} ${program.title} ${program.year}` : "..."}
            </Typography>
            <Typography
              component="div"
              variant="subtitle2"
              css={css`
                color: #818ca1;
              `}>
              {stream ? `${stream.code} ${stream.title} ${stream.year}` : "..."}
            </Typography>
          </Box>
          <Box
            css={css`
              flex-grow: 1;
              flex-direction: column;
            `}>
            Search
          </Box>
          <Box
            css={css`
              flex-direction: column;
            `}>
            <Typography
              component="div"
              variant="h6"
              css={css`
                color: #646c7d;
              `}>
              {name}
            </Typography>
            <Typography
              component="div"
              variant="subtitle2"
              css={css`
                color: #818ca1;
              `}>
              {zId}
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

// NavBar.propTypes = {
//   programId: PropTypes.string,
//   streamId: PropTypes.string
// };

// NavBar.defaultProps = {
//   programId: null,
//   streamId: null
// };

NavBar.defaultProps = {};

export default NavBar;
