/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useContext, useEffect } from "react";

// import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "notistack";

import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../helpers/UserContext";

const NavBar = () => {
  const { userState, userDispatch } = useContext(UserContext);

  const { enqueueSnackbar } = useSnackbar();

  const [zId, setZId] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    userDispatch({ type: "logout" });
    navigate("/login");
  };

  const userId = userState?.zId;
  const { data: program, isLoading: programIsLoading } = useQuery(
    ["programData", userId],
    async () => {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          zid: userId
        })
      };
      try {
        const res = await fetch("http://127.0.0.1:5000/user/program", requestOptions);
        return await res.json();
      } catch (err) {
        console.log("PROGRAM FETCH ERROR: ", err);
        return enqueueSnackbar(err, { variant: "error" });
      }
    },
    {
      enabled: !!userId
    }
  );
  console.log(program, programIsLoading);

  const { data: stream, isLoading: streamIsLoading } = useQuery(
    ["streamData", userId],
    async () => {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          zid: userId
        })
      };
      try {
        const res = await fetch("http://127.0.0.1:5000/user/stream", requestOptions);
        return await res.json();
      } catch (err) {
        console.log("STREAM FETCH ERROR: ", err);
        return enqueueSnackbar(err, { variant: "error" });
      }
    },
    {
      enabled: !!userId
    }
  );
  console.log(stream, streamIsLoading);

  useEffect(() => {
    setZId(userState.zId);
    setName(userState.name);
  }, [userState]);

  useEffect(() => {
    if (program && "error" in program) {
      enqueueSnackbar(program.error, { variant: "warning" });
    }
  }, [program]);

  useEffect(() => {
    if (stream && "error" in stream) {
      enqueueSnackbar(stream.error, { variant: "warning" });
    }
  }, [stream]);

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
              {programIsLoading ? (
                "..."
              ) : (
                <>
                  {!program || "error" in program
                    ? "No program enrolment"
                    : `${program.code} ${program.title} ${program.year}`}
                </>
              )}
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
                  {!stream || "error" in stream
                    ? "No stream enrolment"
                    : `${stream.code} ${stream.title} ${stream.year}`}
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
//   pLoading: PropTypes.bool.isRequired,
//   pCode: PropTypes.string,
//   pTitle: PropTypes.string,
//   pYear: PropTypes.string,
//   pError: PropTypes.bool.isRequired,
//   sLoading: PropTypes.bool.isRequired,
//   sCode: PropTypes.string,
//   sTitle: PropTypes.string,
//   sYear: PropTypes.string,
//   sError: PropTypes.bool.isRequired
// };

// NavBar.defaultProps = {
//   pCode: null,
//   pTitle: null,
//   pYear: null,
//   sCode: null,
//   sTitle: null,
//   sYear: null
// };

export default NavBar;
