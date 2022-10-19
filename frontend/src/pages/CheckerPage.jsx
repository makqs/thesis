/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useContext, useState, useEffect } from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  TextField,
  Typography
} from "@mui/material";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useSnackbar } from "notistack";

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import NavBar from "../components/NavBar";
import RequirementsBox from "../components/RequirementsBox";
import CourseCard from "../components/CourseCard";
import { UserContext } from "../helpers/UserContext";
import { StudentContext } from "../helpers/StudentContext";
import SidebarItem from "../components/SidebarItem";
import SidebarButton from "../components/SidebarButton";

const CheckerPage = () => {
  const navigate = useNavigate();
  const { userState, userDispatch } = useContext(UserContext);
  const { studentState, studentDispatch } = useContext(StudentContext);

  const { enqueueSnackbar } = useSnackbar();

  const [addedCourses, setAddedCourses] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [addValue, setAddValue] = useState(null);

  const [openRemove, setOpenRemove] = useState(false);
  const handleOpenRemove = () => setOpenRemove(true);
  const handleCloseRemove = () => setOpenRemove(false);
  const [removeValue, setRemoveValue] = useState(null);

  const { data: courses, isLoading: coursesIsLoading } = useQuery(["coursesData"], async () => {
    const requestOptions = {
      method: "GET"
    };
    try {
      const res = await fetch("http://127.0.0.1:5000/courses", requestOptions);
      return await res.json();
    } catch (err) {
      console.log("COURSES FETCH ERROR: ", err);
      return enqueueSnackbar(err, { variant: "error" });
    }
  });
  // console.log(courses, coursesIsLoading);

  const studentId = studentState.zId;
  const { data: enrolments, isLoading: enrolmentsIsLoading } = useQuery(
    ["enrolmentsData", studentId],
    async () => {
      const requestOptions = {
        method: "GET"
      };
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/user/enrolments?zid=${studentId}`,
          requestOptions
        );
        return await res.json();
      } catch (err) {
        console.log("ENROLMENTS FETCH ERROR: ", err);
        return enqueueSnackbar(err, { variant: "error" });
      }
    },
    {
      enabled: !!studentId
    }
  );
  // console.log(enrolments, enrolmentsIsLoading);

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

  const programId = program?.program_id;
  const { data: programRules, isLoading: programRulesIsLoading } = useQuery(
    ["programRulesData", programId],
    async () => {
      const requestOptions = {
        method: "GET"
      };
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/program/rules?program_id=${programId}`,
          requestOptions
        );
        return await res.json();
      } catch (err) {
        console.log("PROGRAM RULES FETCH ERROR:", err);
        return enqueueSnackbar(err, { variant: "error" });
      }
    },
    {
      enabled: !!programId
    }
  );
  // console.log(programRules, programRulesIsLoading);

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

  const streamId = stream?.stream_id;
  const { data: streamRules, isLoading: streamRulesIsLoading } = useQuery(
    ["streamRulesData", streamId],
    async () => {
      const requestOptions = {
        method: "GET"
      };
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/stream/rules?stream_id=${streamId}`,
          requestOptions
        );
        return await res.json();
      } catch (err) {
        console.log("STREAM RULES FETCH ERROR", err);
        return enqueueSnackbar(err, { variant: "error" });
      }
    },
    { enabled: !!streamId }
  );
  // console.log(streamRules, streamRulesIsLoading);

  const [modsOpen, setModsOpen] = useState(true);
  const handleModsClick = () => {
    setModsOpen(!modsOpen);
  };

  const [uocOpen, setUocOpen] = useState(true);
  const handleUocClick = () => {
    setUocOpen(!uocOpen);
  };

  useEffect(() => {
    if (!userState) {
      userDispatch({ type: "logout" });
      studentDispatch({ type: "resetStudent" });
      navigate("/login");
    }
  }, []);

  const [cores, setCores] = useState([]);
  const [totalCoreUoc, setTotalCoreUoc] = useState(0);
  const [disciplineElectives, setDisciplineElectives] = useState([]);
  const [totalDiscUoc, setTotalDiscUoc] = useState(0);
  const [genEds, setGenEds] = useState([]);
  const [totalGenedUoc, setTotalGenedUoc] = useState(0);
  const [freeElectives, setFreeElectives] = useState([]);
  const [totalFreeUoc, setTotalFreeUoc] = useState(0);
  useEffect(() => {
    if (
      !enrolmentsIsLoading &&
      !programIsLoading &&
      !programRulesIsLoading &&
      !streamIsLoading &&
      !streamRulesIsLoading
    ) {
      const allRules = programRules.program_rules.concat(streamRules.stream_rules);

      let coreUocCount = 0;
      let discUocCount = 0;
      let genedUocCount = 0;
      let freeUocCount = 0;

      allRules.forEach((r) => {
        if (r[2] === "CC") coreUocCount += parseInt(r[3], 10);
        else if (r[2] === "DE") discUocCount += parseInt(r[3], 10);
        else if (r[2] === "GE") genedUocCount += parseInt(r[3], 10);
        else if (r[2] === "FE") freeUocCount += parseInt(r[3], 10);
      });

      setTotalCoreUoc(coreUocCount);
      setTotalDiscUoc(discUocCount);
      setTotalGenedUoc(genedUocCount);
      setTotalFreeUoc(freeUocCount);

      const coreList = [];
      const discElecList = [];
      const genEdList = [];
      const freeElecList = [];

      // console.log(enrolments.enrolments.concat(addedCourses));
      enrolments.enrolments.concat(addedCourses).forEach((e) => {
        if (["PS", "CR", "DN", "HD", "SY", "EC"].includes(e[6])) {
          // core course check
          if (
            allRules.some((rule) => {
              return rule[2] === "CC" && rule[4].split(",").includes(e[1]);
            })
          ) {
            coreList.push(e);
            return;
          }

          // discipline elective check
          if (
            allRules.some((rule) => {
              if (rule[2] === "DE") {
                return rule[4].split(",").some((code) => {
                  if (code === e[1]) return true;
                  if (new RegExp("^[A-Z]{4}[0-9]XXX$").test(code))
                    return new RegExp(`^${code.slice(0, 5)}...$`).test(e[1]);
                  return false;
                });
              }
              return false;
            })
          ) {
            discElecList.push(e);
            return;
          }

          // gen ed check
          if (
            e[7] === "True" &&
            genEdList.reduce((a, b) => a + parseInt(b[4], 10), 0) + parseInt(e[4], 10) <=
              genedUocCount
          ) {
            genEdList.push(e);
            return;
          }

          // everything else in free electives
          freeElecList.push(e);
        }
      });

      setCores(coreList);
      setDisciplineElectives(discElecList);
      setGenEds(genEdList);
      setFreeElectives(freeElecList);

      // console.log(cores, disciplineElectives, genEds, freeElectives);
    }
  }, [enrolments, programRules, streamRules, addedCourses]);

  return (
    <div
      css={css`
        /* max-height: calc(100vh - 10px); */
        max-height: 100vh;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
      `}>
      <NavBar />
      <Box
        css={css`
          display: flex;
          flex-direction: row;
          flex-grow: 1;
          overflow: hidden;
        `}>
        <Box
          css={css`
            margin: 10px 10px 0px 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow: auto;
          `}>
          {programRulesIsLoading || streamIsLoading ? (
            <></>
          ) : (
            programRules.program_rules.map((prule) => {
              if (prule[2] === "ST") {
                if (prule[4].split(",").includes(stream.code)) {
                  if (streamRulesIsLoading) return <></>;
                  // const excessCourses = [];
                  return streamRules.stream_rules.map((rule) => {
                    let uocCompleted = 0;
                    let children = [];

                    if (rule[2] === "CC") {
                      children = rule[4].split(",").map((code) => {
                        const course = cores.find((e) => e[1] === code);
                        // console.log(code, excessCourses, excessCourses.includes(course));
                        // if (course === undefined || course in excessCourses)
                        if (course === undefined)
                          return <CourseCard key={code} code={code} completed={false} />;
                        const completed =
                          course[1] === code &&
                          ["PS", "CR", "DN", "HD", "SY", "EC"].includes(course[6]);
                        // if (uocCompleted + parseInt(course[4], 10) > parseInt(rule[3], 10)) {
                        //   excessCourses.push(course);
                        //   return <></>;
                        // }
                        if (completed) uocCompleted += parseInt(course[4], 10);
                        return <CourseCard key={code} code={code} completed={completed} />;
                      });
                    } else if (rule[2] === "DE") {
                      const ranges = [];
                      rule[4].split(",").forEach((code) => {
                        if (new RegExp("^[A-Z]{4}[0-9]{4}$").test(code)) {
                          const course = disciplineElectives.find((e) => e[1] === code);
                          if (course === undefined) {
                            children.push(<CourseCard key={code} code={code} completed={false} />);
                            return;
                          }
                          const completed =
                            course[1] === code &&
                            ["PS", "CR", "DN", "HD", "SY", "EC"].includes(course[6]);
                          if (completed) {
                            uocCompleted += parseInt(course[4], 10);
                          }
                          children.push(
                            <CourseCard key={code} code={code} completed={completed} />
                          );
                        } else if (new RegExp("^[A-Z]{4}[0-9]XXX$").test(code)) {
                          ranges.push(<CourseCard key={code} code={code} completed={false} />);
                          disciplineElectives.forEach((c) => {
                            if (new RegExp(`^${code.slice(0, 5)}...$`).test(c[1])) {
                              const completed = ["PS", "CR", "DN", "HD", "SY", "EC"].includes(c[6]);
                              if (completed) {
                                uocCompleted += parseInt(c[4], 10);
                              }
                              children.push(
                                <CourseCard key={c[1]} code={c[1]} completed={completed} />
                              );
                            }
                          });
                        }
                      });
                      children.push(...ranges);
                    } else if (rule[2] === "GE") {
                      children = genEds.map((c) => {
                        uocCompleted += parseInt(c[4], 10);
                        return <CourseCard key={c[1]} code={c[1]} completed />;
                      });
                    } else if (rule[2] === "FE") {
                      // children = [...freeElectives, ...excessCourses].map((c) => {
                      children = freeElectives.map((c) => {
                        uocCompleted += parseInt(c[4], 10);
                        return <CourseCard key={c[1]} code={c[1]} completed />;
                      });
                    }
                    return (
                      <RequirementsBox
                        title={`Stream - ${rule[1]}`}
                        uocCompleted={uocCompleted}
                        minUoc={rule[3]}
                        key={rule[0]}>
                        {children}
                      </RequirementsBox>
                    );
                  });
                }
                const children = prule[4]
                  .split(",")
                  .map((s) => <CourseCard key={s} code={s} completed={false} />);
                return (
                  <RequirementsBox
                    key={prule[0]}
                    title={`Stream - ${prule[1]}`}
                    uocCompleted={0}
                    minUoc={prule[3]}>
                    {children}
                  </RequirementsBox>
                );
              }
              let children = [];
              let uocCompleted = 0;
              if (prule[2] === "GE") {
                children = genEds.map((c) => {
                  uocCompleted += parseInt(c[4], 10);
                  return <CourseCard key={c[1]} code={c[1]} completed />;
                });
              }
              return (
                <RequirementsBox
                  key={prule[0]}
                  title={`Program - ${prule[1]}`}
                  uocCompleted={uocCompleted}
                  minUoc={prule[3]}>
                  {children}
                </RequirementsBox>
              );
            })
          )}
        </Box>
        {programRulesIsLoading || streamIsLoading ? (
          <></>
        ) : (
          <Box
            css={css`
              background-color: #f7fafc;
              min-width: 300px;
              flex-grow: 1;
              height: 100%;
            `}>
            <List
              css={css`
                width: 100%;
                padding-top: 0;
                padding-bottom: 0;
                border-style: solid;
                border-color: #bfbfbf;
                border-width: 0px 0px 1px 1px;
              `}
              component="nav"
              aria-labelledby="nested-list-subheader">
              <ListItemButton
                onClick={handleModsClick}
                css={css`
                  background-color: #f3f3f3;
                  border-style: solid;
                  border-color: #bfbfbf;
                  border-width: 1px 0px 0px 0px;
                `}>
                <ListItemText primary="Modifiers" />
                {modsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={modsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {/* <SidebarButton title="Change program" /> */}
                  <SidebarButton title="Add course" onClick={handleOpenAdd} />
                  <Modal
                    open={openAdd}
                    onClose={handleCloseAdd}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500
                    }}>
                    <Fade in={openAdd}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 400,
                          bgcolor: "background.paper",
                          border: "2px solid #000",
                          boxShadow: 24,
                          p: 4,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "centre"
                        }}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                          Add a course
                        </Typography>
                        <Autocomplete
                          value={addValue}
                          onChange={(event, newValue) => {
                            setAddValue(newValue);
                          }}
                          disablePortal
                          options={
                            coursesIsLoading || !enrolments || "error" in enrolments
                              ? []
                              : courses.courses
                                  .filter((c) => {
                                    // console.log(enrolments.enrolments.concat(addedCourses));
                                    return enrolments.enrolments
                                      .concat(addedCourses)
                                      .every(
                                        (e) =>
                                          c[0] !== e[0] ||
                                          !["PS", "CR", "DN", "HD", "SY", "EC"].includes(e[6])
                                      );
                                  })
                                  .map((c) => {
                                    return { label: c[1], id: c[0] };
                                  })
                          }
                          sx={{ width: 300 }}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          renderInput={(params) => <TextField {...params} label="Course" />}
                        />
                        <Button
                          variant="contained"
                          css={css`
                            background-color: #4299e1;
                            margin-left: 10px;
                          `}
                          onClick={() => {
                            if (addValue === null) return;
                            const course = courses.courses.find((c) => c[0] === addValue.id);
                            setAddedCourses([
                              ...addedCourses,
                              [
                                course[0],
                                course[1],
                                course[2],
                                course[3],
                                course[4],
                                50,
                                "SY",
                                course[5]
                              ]
                            ]);
                            setAddValue(null);
                            handleCloseAdd();
                          }}>
                          Add course
                        </Button>
                      </Box>
                    </Fade>
                  </Modal>
                  <SidebarButton title="Remove course" onClick={handleOpenRemove} />
                  <Modal
                    open={openRemove}
                    onClose={handleCloseRemove}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500
                    }}>
                    <Fade in={openRemove}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 400,
                          bgcolor: "background.paper",
                          border: "2px solid #000",
                          boxShadow: 24,
                          p: 4,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "centre"
                        }}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                          Remove a course
                        </Typography>
                        <Autocomplete
                          value={removeValue}
                          onChange={(event, newValue) => {
                            setRemoveValue(newValue);
                          }}
                          disablePortal
                          options={addedCourses.map((c) => {
                            return { label: c[1], id: c[0] };
                          })}
                          sx={{ width: 300 }}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          renderInput={(params) => <TextField {...params} label="Course" />}
                        />
                        <Button
                          variant="contained"
                          css={css`
                            background-color: #4299e1;
                            margin-left: 10px;
                          `}
                          onClick={() => {
                            if (removeValue === null) return;
                            const newCourses = addedCourses.filter((c) => c[0] !== removeValue.id);
                            setAddedCourses(newCourses);
                            setRemoveValue(null);
                            handleCloseRemove();
                          }}>
                          Remove course
                        </Button>
                      </Box>
                    </Fade>
                  </Modal>
                  <SidebarButton
                    title="Reset modifiers"
                    isRed
                    onClick={() => {
                      setAddedCourses([]);
                    }}
                  />
                </List>
              </Collapse>
              <ListItemButton
                onClick={handleUocClick}
                css={css`
                  background-color: #f3f3f3;
                  border-style: solid;
                  border-color: #bfbfbf;
                  border-width: 1px 0px 0px 0px;
                  padding: 8px 16px;
                `}>
                <ListItemText primary="UOC" />
                <div
                  css={css`
                    display: flex;
                    flex-direction: row;
                  `}>
                  <ListItemText
                    primary={`${
                      Math.min(
                        cores.map((c) => parseInt(c[4], 10)).reduce((a, b) => a + b, 0),
                        totalCoreUoc
                      ) +
                      Math.min(
                        disciplineElectives
                          .map((c) => parseInt(c[4], 10))
                          .reduce((a, b) => a + b, 0),
                        totalDiscUoc
                      ) +
                      Math.min(
                        genEds.map((c) => parseInt(c[4], 10)).reduce((a, b) => a + b, 0),
                        totalGenedUoc
                      ) +
                      Math.min(
                        freeElectives.map((c) => parseInt(c[4], 10)).reduce((a, b) => a + b, 0),
                        totalFreeUoc
                      )
                    } / ${totalCoreUoc + totalDiscUoc + totalGenedUoc + totalFreeUoc}`}
                  />
                  {uocOpen ? <ExpandLess /> : <ExpandMore />}
                </div>
              </ListItemButton>
              <Collapse in={uocOpen} timeout="auto" unmountOnExit>
                {/* {totalCoreUoc + totalDiscUoc + totalGenedUoc + totalFreeUoc} */}
                <List component="div" disablePadding>
                  <SidebarItem
                    title="Cores"
                    completedUoc={Math.min(
                      cores.map((c) => parseInt(c[4], 10)).reduce((a, b) => a + b, 0),
                      totalCoreUoc
                    )}
                    totalUoc={totalCoreUoc}
                  />
                  <SidebarItem
                    title="Discipline Electives"
                    completedUoc={Math.min(
                      disciplineElectives.map((c) => parseInt(c[4], 10)).reduce((a, b) => a + b, 0),
                      totalDiscUoc
                    )}
                    totalUoc={totalDiscUoc}
                  />
                  <SidebarItem
                    title="General Education"
                    completedUoc={Math.min(
                      genEds.map((c) => parseInt(c[4], 10)).reduce((a, b) => a + b, 0),
                      totalGenedUoc
                    )}
                    totalUoc={totalGenedUoc}
                  />
                  <SidebarItem
                    title="Free Electives"
                    completedUoc={Math.min(
                      freeElectives.map((c) => parseInt(c[4], 10)).reduce((a, b) => a + b, 0),
                      totalFreeUoc
                    )}
                    totalUoc={totalFreeUoc}
                  />
                </List>
              </Collapse>
            </List>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default CheckerPage;
