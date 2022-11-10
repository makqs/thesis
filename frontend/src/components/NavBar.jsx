/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useContext, useEffect } from "react";

import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Autocomplete, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "notistack";

import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../helpers/UserContext";
import { StudentContext } from "../helpers/StudentContext";

const NavBar = ({ resetModifiers }) => {
  const { userState, userDispatch } = useContext(UserContext);
  const { studentState, studentDispatch } = useContext(StudentContext);

  const { enqueueSnackbar } = useSnackbar();

  const [userZId, setUserZId] = useState("");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    userDispatch({ type: "logout" });
    studentDispatch({ type: "resetStudent" });
    navigate("/login");
  };

  const studentId = studentState?.zId;
  const tempProgramId = studentState?.tempProgramId;
  const { data: program, isLoading: programIsLoading } = useQuery(
    ["programData", studentId, tempProgramId],
    async () => {
      const requestOptions = {
        method: "GET"
      };
      try {
        const res = await fetch(
          tempProgramId === null
            ? `http://127.0.0.1:5000/user/program?zid=${studentId}`
            : `http://127.0.0.1:5000/program?program_id=${tempProgramId}`,
          requestOptions
        );
        return await res.json();
      } catch (err) {
        console.log("PROGRAM FETCH ERROR: ", err);
        return enqueueSnackbar(err, { variant: "error" });
      }
    },
    {
      enabled: !!studentId
    }
  );

  const tempStreamId = studentState?.tempStreamId;
  const { data: streams, isLoading: streamsIsLoading } = useQuery(
    ["streamData", studentId, tempStreamId],
    async () => {
      const requestOptions = {
        method: "GET"
      };
      try {
        const res = await fetch(
          tempStreamId === null
            ? `http://127.0.0.1:5000/user/streams?zid=${studentId}`
            : `http://127.0.0.1:5000/stream?stream_id=${tempStreamId}`,
          requestOptions
        );
        return await res.json();
      } catch (err) {
        console.log("STREAM FETCH ERROR: ", err);
        return enqueueSnackbar(err, { variant: "error" });
      }
    },
    {
      enabled: !!studentId
    }
  );

  const isStaff = userState?.isStaff;
  const { data: students, isLoading: studentsIsLoading } = useQuery(
    ["studentsData", isStaff],
    async () => {
      const requestOptions = {
        method: "GET"
      };
      try {
        const res = await fetch("http://127.0.0.1:5000/students", requestOptions);
        return await res.json();
      } catch (err) {
        console.log("STUDENTS FETCH ERROR: ", err);
        return enqueueSnackbar(err, { variant: "error" });
      }
    },
    {
      enabled: !!isStaff
    }
  );

  useEffect(() => {
    if (userState) {
      setUserZId(userState.zId);
      setUserName(userState.name);
    }
  }, [userState]);

  useEffect(() => {
    if (program && "error" in program) {
      enqueueSnackbar(program.error, { variant: "warning" });
    }
  }, [program]);

  useEffect(() => {
    if (streams && streams.length === 0) {
      enqueueSnackbar(streams.error, { variant: "warning" });
    }
  }, [streams]);

  return (
    <Box
      css={css`
        flex-grow: 0;
      `}>
      <AppBar position="static">
        <Toolbar
          css={css`
            background-color: #ffffff;
            display: flex;
            justify-content: space-between;
            padding-top: 2px;
            padding-bottom: 2px;
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
              {!userState ||
              !studentState ||
              (userState.isStaff && programIsLoading && Object.keys(studentState).length !== 0) ||
              (!userState.isStaff && programIsLoading) ? (
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
              {!userState ||
              !studentState ||
              (userState.isStaff && streamsIsLoading && Object.keys(studentState).length !== 0) ||
              (!userState.isStaff && streamsIsLoading) ? (
                "..."
              ) : (
                <>
                  {!streams || streams.length === 0
                    ? "No stream enrolment"
                    : streams.map(({ code, title }) => `${code} ${title}`).join(" / ")}
                </>
              )}
            </Typography>
          </Box>
          {isStaff && (
            <Box
              css={css`
                flex-grow: 1;
                flex-direction: column;
                color: #646c7d;
              `}>
              <Autocomplete
                disablePortal
                options={
                  studentsIsLoading
                    ? []
                    : students.map((s) => {
                        return { label: `${s.zid} ${s.name}`, id: s.zid };
                      })
                }
                sx={{ width: 300 }}
                onChange={(e, value) => {
                  if (value) {
                    studentDispatch({
                      type: "setStudent",
                      zId: value.id
                    });
                    resetModifiers();
                  }
                }}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextField {...params} label="Student" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
          )}
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
              {userName}
            </Typography>
            <Typography
              component="div"
              variant="subtitle2"
              css={css`
                color: #818ca1;
                text-align: right;
              `}>
              {userZId}
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
  resetModifiers: PropTypes.func.isRequired
};

NavBar.defaultProps = {};

export default NavBar;
