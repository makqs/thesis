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

  const [totalRules, setTotalRules] = useState({});
  console.log(totalRules, setTotalRules);

  const getCompletedUoc = (type) =>
    Object.keys(totalRules).reduce(
      (a, b) =>
        b.split(",")[2] !== type
          ? a
          : a + totalRules[b].reduce((x, y) => x + parseInt(y[4], 10), 0),
      0
    );

  const getTotalUoc = (type) =>
    Object.keys(totalRules).reduce(
      (a, b) => (b.split(",")[2] !== type ? a : a + parseInt(b.split(",")[3], 10)),
      0
    );

  useEffect(() => {
    if (!enrolmentsIsLoading && !programIsLoading && !programRulesIsLoading && !streamIsLoading) {
      // MANTRA: tie the rule to the courses that fulfil that rule, i.e. do all the calculations here and just pass off to components
      // TODO: add looping through specific rules and split courses based on that rather than all rules altogether

      // { rule definition => list of courses that fulfil that definition }
      const rules = {};
      // list of enrolments that havent been sorted into rules yet
      let enrolmentsLeft = enrolments.enrolments
        .concat(addedCourses)
        .filter((course) => ["PS", "CR", "DN", "HD", "SY", "EC"].includes(course[6]));

      console.log(rules, enrolmentsLeft);

      programRules.program_rules.forEach((programRule) => {
        // console.log(programRule);

        // stream case
        if (programRule[2] === "ST") {
          // student has selected stream
          if (programRule[4].split(",").includes(stream.code) && !streamRulesIsLoading) {
            // console.log(`yay student selected stream ${stream.code}`);
            streamRules.stream_rules.forEach((streamRule) => {
              // console.log(streamRule);
              rules[streamRule] = [];

              // rule definition looks like COMP1511,MATH1131;MATH1231 or COMP3XXX,COMP4XXX
              // should cover CC and DE cases
              if (
                new RegExp(
                  "^[A-Z]{4}[0-9]([0-9]{3}|X{3})([,;][A-Z]{4}[0-9]([0-9]{3}|X{3}))*$"
                ).test(streamRule[4])
              ) {
                enrolmentsLeft = enrolmentsLeft.filter((course) => {
                  streamRule[4].split(",").forEach((code) => {
                    if (
                      // COMP1511 = COMP1511
                      code === course[1] ||
                      // COMP6771 like COMP6XXX
                      (new RegExp("^[A-Z]{4}[0-9]XXX$").test(code) &&
                        new RegExp(`^${code.slice(0, 5)}...$`).test(course[1]))
                    ) {
                      if (
                        // havent exceeded UOC for this rule yet
                        rules[streamRule].reduce((a, b) => a + parseInt(b[4], 10), 0) +
                          parseInt(course[4], 10) <=
                        parseInt(streamRule[3], 10)
                      )
                        rules[streamRule].push(course);
                    }
                  });
                  if (rules[streamRule].includes(course)) return false;
                  return true;
                });
              }

              // should cover every gen ed case
              if (streamRule[2] === "GE") {
                enrolmentsLeft = enrolmentsLeft.filter((course) => {
                  if (
                    course[7] === "True" &&
                    rules[streamRule].reduce((a, b) => a + parseInt(b[4], 10), 0) +
                      parseInt(course[4], 10) <=
                      parseInt(streamRule[3], 10)
                  ) {
                    rules[streamRule].push(course);
                    return false;
                  }
                  return true;
                });
              }

              // leave stream free electives to the end
            });
          } else {
            // user hasn't selected stream
            rules[programRule] = [];
          }
        }

        // rule definition looks like COMP1511,MATH1131;MATH1231 or COMP3XXX,COMP4XXX
        // should cover CC and DE cases
        if (
          new RegExp("^[A-Z]{4}[0-9]([0-9]{3}|X{3})([,;][A-Z]{4}[0-9]([0-9]{3}|X{3}))*$").test(
            programRule[4]
          )
        ) {
          rules[programRule] = [];
          enrolmentsLeft = enrolmentsLeft.filter((course) => {
            programRule[4].split(",").forEach((code) => {
              if (
                // COMP1511 = COMP1511
                code === course[1] ||
                // COMP6771 like COMP6XXX
                (new RegExp("^[A-Z]{4}[0-9]XXX$").test(code) &&
                  new RegExp(`^${code.slice(0, 5)}...$`).test(course[1]))
              ) {
                if (
                  // havent exceeded UOC for this rule yet
                  rules[programRule].reduce((a, b) => a + parseInt(b[4], 10), 0) +
                    parseInt(course[4], 10) <=
                  parseInt(programRule[3], 10)
                )
                  rules[programRule].push(course);
              }
            });
            if (rules[programRule].includes(course)) return false;
            return true;
          });
        }

        // should cover every gen ed case
        if (programRule[2] === "GE") {
          rules[programRule] = [];
          enrolmentsLeft = enrolmentsLeft.filter((course) => {
            if (
              course[7] === "True" &&
              rules[programRule].reduce((a, b) => a + parseInt(b[4], 10), 0) +
                parseInt(course[4], 10) <=
                parseInt(programRule[3], 10)
            ) {
              rules[programRule].push(course);
              return false;
            }
            return true;
          });
        }

        // do all free electives at the end
        if (programRule[2] === "FE") {
          rules[programRule] = [];
          enrolmentsLeft = enrolmentsLeft.filter((course) => {
            rules[programRule].push(course);
            return false;
          });
        }
      });

      // do stream free electives last
      const feRule = Object.keys(rules).find((rule) => rule.split(",")[2] === "FE");
      if (feRule) {
        enrolmentsLeft = enrolmentsLeft.filter((course) => {
          rules[feRule].push(course);
          return false;
        });
      }

      console.log(rules, enrolmentsLeft);
      setTotalRules(rules);
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
            Object.keys(totalRules).map((rawRule) => {
              const rule = rawRule.split(",");

              // stream will only be in the rules if a stream wasn't selected
              if (rule[2] === "ST") {
                const children = rule
                  .splice(4)
                  .map((s) => <CourseCard key={`${rawRule}-${s}`} code={s} completed={false} />);
                return (
                  <RequirementsBox
                    key={rawRule}
                    title={`Program - ${rule[1]}`}
                    uocCompleted={0}
                    minUoc={rule[3]}>
                    {children}
                  </RequirementsBox>
                );
              }

              // core courses and discipline electives
              if (rule[2] === "CC" || rule[2] === "DE") {
                const definition = rule.splice(4).join(",");
                if (
                  new RegExp(
                    "^[A-Z]{4}[0-9]([0-9]{3}|X{3})([,;][A-Z]{4}[0-9]([0-9]{3}|X{3}))*$"
                  ).test(definition) &&
                  new RegExp("[A-Z]{4}[0-9]X{3}").test(definition)
                ) {
                  const ranges = [];
                  const children = [];
                  definition.split(",").forEach((code) => {
                    if (new RegExp("^[A-Z]{4}[0-9]XXX$").test(code)) {
                      ranges.push(
                        <CourseCard key={`${rawRule}-${code}`} code={code} completed={false} />
                      );
                      return;
                    }

                    // [A-Z]{4}[0-9]{4} (e.g. COMP1511) case
                    if (totalRules[rawRule].some((r) => r[1] === code)) {
                      children.push(
                        <CourseCard key={`${rawRule}-${code}`} code={code} completed />
                      );
                      return;
                    }
                    children.push(
                      <CourseCard key={`${rawRule}-${code}`} code={code} completed={false} />
                    );
                  });

                  if (rule[2] === "DE")
                    children.push(
                      ...totalRules[rawRule].map((code) => (
                        <CourseCard key={`${rawRule}-${code}`} code={code[1]} completed />
                      ))
                    );

                  children.push(...ranges);

                  return (
                    <RequirementsBox
                      title={`Stream - ${rule[1]}`}
                      uocCompleted={totalRules[rawRule].reduce((a, b) => a + parseInt(b[4], 10), 0)}
                      minUoc={rule[3]}
                      key={rawRule}>
                      {children}
                    </RequirementsBox>
                  );
                }

                // [A-Z]{4}[0-9]{4}([,;][A-Z]{4}[0-9]{4})* (COMP1511,MATH1131;MATH1141) case
                const children = definition.split(",").map((code) => {
                  if (totalRules[rawRule].some((r) => r[1] === code)) {
                    return <CourseCard key={`${rawRule}-${code}`} code={code} completed />;
                  }
                  return <CourseCard key={`${rawRule}-${code}`} code={code} completed={false} />;
                });

                return (
                  <RequirementsBox
                    title={`Stream - ${rule[1]}`}
                    uocCompleted={totalRules[rawRule].reduce((a, b) => a + parseInt(b[4], 10), 0)}
                    minUoc={rule[3]}
                    key={rawRule}>
                    {children}
                  </RequirementsBox>
                );
              }

              // general educations and free electives
              if (rule[2] === "GE" || rule[2] === "FE") {
                const children = totalRules[rawRule].map((code) => (
                  <CourseCard key={`${rawRule}-${code}`} code={code[1]} completed />
                ));
                return (
                  <RequirementsBox
                    title={`Stream - ${rule[1]}`}
                    uocCompleted={totalRules[rawRule].reduce((a, b) => a + parseInt(b[4], 10), 0)}
                    minUoc={rule[3]}
                    key={rawRule}>
                    {children}
                  </RequirementsBox>
                );
              }

              console.log(rule, totalRules[rule]);

              return <></>;
            })
          )}
        </Box>
        {!(programRulesIsLoading || streamIsLoading) && (
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
                  {addedCourses.length !== 0 && (
                    <SidebarButton title="Remove course" onClick={handleOpenRemove} />
                  )}
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
                      getCompletedUoc("CC") +
                      getCompletedUoc("DE") +
                      getCompletedUoc("GE") +
                      getCompletedUoc("FE") +
                      getCompletedUoc("ST")
                    } / ${
                      getTotalUoc("CC") +
                      getTotalUoc("DE") +
                      getTotalUoc("GE") +
                      getTotalUoc("FE") +
                      getTotalUoc("ST")
                    }`}
                  />
                  {uocOpen ? <ExpandLess /> : <ExpandMore />}
                </div>
              </ListItemButton>
              <Collapse in={uocOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {[
                    ["Stream", "ST"],
                    ["Cores", "CC"],
                    ["Discipline Electives", "DE"],
                    ["General Education", "GE"],
                    ["Free Electives", "FE"]
                  ].map(
                    (type) =>
                      Object.keys(totalRules).some((rule) => rule.split(",")[2] === type[1]) && (
                        <SidebarItem
                          title={type[0]}
                          completedUoc={getCompletedUoc(type[1])}
                          totalUoc={getTotalUoc(type[1])}
                        />
                      )
                  )}
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
