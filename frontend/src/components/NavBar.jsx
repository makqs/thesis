/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useContext, useEffect } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../helpers/UserContext";

const NavBar = () => {
  const { userState, userDispatch } = useContext(UserContext);

  const [zId, setZId] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    userDispatch({ type: "logout" });
    navigate("/login");
  };

  const { data: programData, isLoading: programIsLoading } = useQuery(
    [userState, "programData"],
    () => {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          zid: userState.zId
        })
      };
      return fetch("http://127.0.0.1:5000/user/program", requestOptions).then((res) => res.json());
    }
  );

  console.log(programData);

  const { data: streamData, isLoading: streamIsLoading } = useQuery(
    [userState, "streamData"],
    () => {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          zid: userState.zId
        })
      };
      return fetch("http://127.0.0.1:5000/user/stream", requestOptions).then((res) => res.json());
    }
  );

  console.log(streamData);

  useEffect(() => {
    setZId(userState.zId);
    setName(userState.name);
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
              {programIsLoading
                ? "..."
                : `${programData.code} ${programData.title} ${programData.year}`}
            </Typography>
            <Typography
              component="div"
              variant="subtitle2"
              css={css`
                color: #818ca1;
              `}>
              {streamIsLoading ? (
                "..."
              ) : (
                <>
                  {"error" in streamData
                    ? "No stream enrolment"
                    : `${streamData.code} ${streamData.title} ${streamData.year}`}
                </>
              )}
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
                text-align: right;
              `}>
              {name}
            </Typography>
            <Typography
              component="div"
              variant="subtitle2"
              css={css`
                color: #818ca1;
                text-align: right;
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
