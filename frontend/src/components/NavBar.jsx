/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useContext, useEffect } from "react";

// import PropTypes from "prop-types";

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

const NavBar = () => {
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
  const { data: program, isLoading: programIsLoading } = useQuery(
    ["programData", studentId],
    async () => {
      const requestOptions = {
        method: "GET"
      };
      try {
        const res = await fetch(`http://127.0.0.1:5000/program?zid=${studentId}`, requestOptions);
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
  // console.log(program, programIsLoading);

  const { data: stream, isLoading: streamIsLoading } = useQuery(
    ["streamData", studentId],
    async () => {
      const requestOptions = {
        method: "GET"
      };
      try {
        const res = await fetch(`http://127.0.0.1:5000/stream?zid=${studentId}`, requestOptions);
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
  // console.log(stream, streamIsLoading);

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
  // console.log(students, studentsIsLoading);

  useEffect(() => {
    setUserZId(userState.zId);
    setUserName(userState.name);
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
              {(userState.isStaff && programIsLoading && Object.keys(studentState).length !== 0) ||
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
              {(userState.isStaff && streamIsLoading && Object.keys(studentState).length !== 0) ||
              (!userState.isStaff && streamIsLoading) ? (
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
                    : students.students.map((s) => {
                        return { label: `${s[0]} ${s[1]}`, id: s[0] };
                      })
                }
                sx={{ width: 300 }}
                onChange={(e, value) => {
                  // console.log(e, value);
                  if (value) {
                    studentDispatch({
                      type: "setStudent",
                      zId: value.id
                    });
                  }
                }}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextField {...params} label="Student" />}
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
