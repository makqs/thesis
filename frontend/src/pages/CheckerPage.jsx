/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useContext, useState, useEffect } from "react";
import { Autocomplete, Backdrop, Box, Button, Fade, Modal, TextField } from "@mui/material";

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

// TODOs:
//  - add stream and program changing
//  - add eng program discipline elective same as stream thing
//  - add tokens and cookies
//  - automate program and stream rules with api

// DONE
//  - order gen eds by decrerasing UOC
//  - add bucket of courses that don't fit a rule
//  - fix course card spacing and arrangement
//  - add faculty and school checks to gen eds

const CheckerPage = () => {
  const navigate = useNavigate();
  const { userState, userDispatch } = useContext(UserContext);
  const { studentState, studentDispatch } = useContext(StudentContext);

  const { enqueueSnackbar } = useSnackbar();

  const [addedCourses, setAddedCourses] = useState([]);
  const [lockedCourses, setLockedCourses] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [addValue, setAddValue] = useState(null);

  const [openChangeStream, setOpenChangeStream] = useState(false);
  const handleOpenChangeStream = () => setOpenChangeStream(true);
  const handleCloseChangeStream = () => setOpenChangeStream(false);
  const [changeStreamValue, setChangeStreamValue] = useState(null);

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

  const { data: programStreams, isLoading: programStreamsIsLoading } = useQuery(
    ["programStreamsData", programId],
    async () => {
      const requestOptions = {
        method: "GET"
      };
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/streams?program_id=${programId}`,
          requestOptions
        );
        return await res.json();
      } catch (err) {
        console.log("STREAMS FETCH ERROR:", err);
        return enqueueSnackbar(err, { variant: "error" });
      }
    },
    {
      enabled: !!programId
    }
  );

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

  const getCompletedUoc = (type) =>
    Object.keys(totalRules).reduce(
      (a, b) =>
        JSON.parse(b).type !== type
          ? a
          : a + totalRules[b].reduce((x, y) => x + parseInt(y.uoc, 10), 0),
      0
    );

  const getTotalUoc = (type) =>
    Object.keys(totalRules).reduce(
      (a, b) => (JSON.parse(b).type !== type ? a : a + parseInt(JSON.parse(b).min_uoc, 10)),
      0
    );

  const resetModifiers = () => {
    setAddedCourses([]);
  };

  useEffect(() => {
    console.log("reset time");
    resetModifiers();
  }, [studentState]);

  useEffect(() => {
    if (!enrolmentsIsLoading && !programIsLoading && !programRulesIsLoading && !streamIsLoading) {
      // MANTRA: tie the rule to the courses that fulfil that rule, i.e. do all the calculations here and just pass off to components
      // TODO: add looping through specific rules and split courses based on that rather than all rules altogether

      // { rule definition => list of courses that fulfil that definition }
      const rules = {};
      // list of enrolments that havent been sorted into rules yet
      let enrolmentsLeft = enrolments
        .concat(addedCourses)
        .filter((course) => ["PS", "CR", "DN", "HD", "SY", "EC"].includes(course.grade));

      const lockedCoursesToAdd = [];

      programRules.forEach((programRule) => {
        // stream case
        if (programRule.type === "ST") {
          // student has selected stream
          if (programRule.definition.split(",").includes(stream.code) && !streamRulesIsLoading) {
            streamRules.forEach((streamRule) => {
              rules[JSON.stringify(streamRule)] = [];

              // rule definition looks like COMP1511,MATH1131;MATH1231 or COMP3XXX,COMP4XXX
              // should cover CC and DE cases
              if (
                new RegExp(
                  "^[A-Z]{4}[0-9]([0-9]{3}|X{3})([,;][A-Z]{4}[0-9]([0-9]{3}|X{3}))*$"
                ).test(streamRule.definition)
              ) {
                enrolmentsLeft = enrolmentsLeft.filter((course) => {
                  streamRule.definition.split(",").forEach((code) => {
                    // either or course check (e.g. MATH1131;MATH1141)
                    if (new RegExp("^[A-Z]{4}[0-9]{4}(;[A-Z]{4}[0-9]{4})+$").test(code)) {
                      let exclusions = code.split(";");
                      let done;
                      exclusions = exclusions.filter((exclusion) => {
                        if (
                          exclusion === course.code &&
                          rules[JSON.stringify(streamRule)].reduce(
                            (a, b) => a + parseInt(b.uoc, 10),
                            0
                          ) +
                            parseInt(course.uoc, 10) <=
                            parseInt(streamRule.min_uoc, 10)
                        ) {
                          done = exclusion;
                          return false;
                        }
                        return true;
                      });
                      // if one of the courses has been completed
                      if (done) {
                        rules[JSON.stringify(streamRule)].push(course);
                        lockedCoursesToAdd.push(...exclusions);
                      }
                    } else if (
                      // COMP1511 = COMP1511
                      code === course.code ||
                      // COMP6771 like COMP6XXX
                      (new RegExp("^[A-Z]{4}[0-9]XXX$").test(code) &&
                        new RegExp(`^${code.slice(0, 5)}...$`).test(course.code))
                    ) {
                      if (
                        // havent exceeded UOC for this rule yet
                        rules[JSON.stringify(streamRule)].reduce(
                          (a, b) => a + parseInt(b.uoc, 10),
                          0
                        ) +
                          parseInt(course.uoc, 10) <=
                        parseInt(streamRule.min_uoc, 10)
                      )
                        rules[JSON.stringify(streamRule)].push(course);
                    }
                  });
                  if (rules[JSON.stringify(streamRule)].includes(course)) return false;
                  return true;
                });
              }

              // should cover every gen ed case
              if (streamRule.type === "GE") {
                enrolmentsLeft = enrolmentsLeft.filter((course) => {
                  if (
                    course.is_ge === "True" &&
                    course.faculty !== program.faculty &&
                    rules[JSON.stringify(streamRule)].reduce((a, b) => a + parseInt(b.uoc, 10), 0) +
                      parseInt(course.uoc, 10) <=
                      parseInt(streamRule.min_uoc, 10)
                  ) {
                    rules[JSON.stringify(streamRule)].push(course);
                    return false;
                  }
                  return true;
                });
              }

              // leave stream free electives to the end
            });
          } else {
            // user hasn't selected stream
            rules[JSON.stringify(programRule)] = [];
          }
        }

        // rule definition looks like COMP1511,MATH1131;MATH1231 or COMP3XXX,COMP4XXX
        // should cover CC and DE cases
        if (
          new RegExp("^[A-Z]{4}[0-9]([0-9]{3}|X{3})([,;][A-Z]{4}[0-9]([0-9]{3}|X{3}))*$").test(
            programRule.definition
          )
        ) {
          rules[JSON.stringify(programRule)] = [];
          enrolmentsLeft = enrolmentsLeft.filter((course) => {
            programRule.definition.split(",").forEach((code) => {
              // either or course check (e.g. MATH1131;MATH1141)
              if (new RegExp("^[A-Z]{4}[0-9]{4}(;[A-Z]{4}[0-9]{4})+$").test(code)) {
                let exclusions = code.split(";");
                let done;
                exclusions = exclusions.filter((exclusion) => {
                  if (
                    exclusion === course.code &&
                    rules[JSON.stringify(programRule)].reduce(
                      (a, b) => a + parseInt(b.uoc, 10),
                      0
                    ) +
                      parseInt(course.uoc, 10) <=
                      parseInt(programRule.min_uoc, 10)
                  ) {
                    done = exclusion;
                    return false;
                  }
                  return true;
                });
                // if one of the courses has been completed
                if (done) {
                  rules[JSON.stringify(programRule)].push(course);
                  lockedCoursesToAdd.push(...exclusions);
                }
              } else if (
                // COMP1511 = COMP1511
                code === course.code ||
                // COMP6771 like COMP6XXX
                (new RegExp("^[A-Z]{4}[0-9]XXX$").test(code) &&
                  new RegExp(`^${code.slice(0, 5)}...$`).test(course.code))
              ) {
                if (
                  // havent exceeded UOC for this rule yet
                  rules[JSON.stringify(programRule)].reduce((a, b) => a + parseInt(b.uoc, 10), 0) +
                    parseInt(course.uoc, 10) <=
                  parseInt(programRule.min_uoc, 10)
                )
                  rules[JSON.stringify(programRule)].push(course);
              }
            });
            if (rules[JSON.stringify(programRule)].includes(course)) return false;
            return true;
          });
        }

        // should cover every gen ed case
        if (programRule.type === "GE") {
          rules[JSON.stringify(programRule)] = [];
          enrolmentsLeft.sort((a, b) => parseInt(b.uoc, 10) - parseInt(a.uoc, 10));
          enrolmentsLeft = enrolmentsLeft.filter((course) => {
            if (
              course.is_ge === "True" &&
              course.faculty !== program.faculty &&
              rules[JSON.stringify(programRule)].reduce((a, b) => a + parseInt(b.uoc, 10), 0) +
                parseInt(course.uoc, 10) <=
                parseInt(programRule.min_uoc, 10)
            ) {
              rules[JSON.stringify(programRule)].push(course);
              return false;
            }
            return true;
          });
        }

        // do all free electives at the end
        if (programRule.type === "FE") {
          rules[JSON.stringify(programRule)] = [];
          enrolmentsLeft = enrolmentsLeft.filter((course) => {
            if (
              rules[JSON.stringify(programRule)].reduce((a, b) => a + parseInt(b.uoc, 10), 0) +
                parseInt(course.uoc, 10) <=
              parseInt(programRule.min_uoc, 10)
            ) {
              rules[JSON.stringify(programRule)].push(course);
              return false;
            }
            return true;
          });
        }
      });

      // do stream free electives last
      Object.keys(rules).forEach((rule) => {
        if (JSON.parse(rule).type === "FE") {
          enrolmentsLeft = enrolmentsLeft.filter((course) => {
            if (
              rules[rule].reduce((a, b) => a + parseInt(b.uoc, 10), 0) + parseInt(course.uoc, 10) <=
              parseInt(JSON.parse(rule).min_uoc, 10)
            ) {
              rules[rule].push(course);
              return false;
            }
            return true;
          });
        }
      });

      // any courses that didn't fit into a rule
      if (enrolmentsLeft.length !== 0) {
        rules[
          JSON.stringify({
            rule_id: -1,
            name: "Not Counted",
            type: "NC",
            min_uoc: "0",
            definition: null
          })
        ] = enrolmentsLeft;
      }

      setLockedCourses(lockedCoursesToAdd);
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
              const rule = JSON.parse(rawRule);

              // stream will only be in the rules if a stream wasn't selected
              if (rule.type === "ST") {
                const children = rule.definition
                  .split(",")
                  .map((s) => <CourseCard key={`${rawRule}-${s}`} code={s} />);
                return (
                  <RequirementsBox
                    key={rawRule}
                    title={`${"program_rule_id" in rule ? "Program" : "Stream"} - ${rule.name}`}
                    uocCompleted={0}
                    minUoc={rule.min_uoc}>
                    {children}
                  </RequirementsBox>
                );
              }

              // core courses and discipline electives
              if (rule.type === "CC" || rule.type === "DE") {
                if (
                  new RegExp(
                    "^[A-Z]{4}[0-9]([0-9]{3}|X{3})([,;][A-Z]{4}[0-9]([0-9]{3}|X{3}))*$"
                  ).test(rule.definition) &&
                  new RegExp("[A-Z]{4}[0-9]X{3}").test(rule.definition)
                ) {
                  const ranges = [];
                  const children = [];
                  rule.definition.split(",").forEach((code) => {
                    if (new RegExp("^[A-Z]{4}[0-9]XXX$").test(code)) {
                      ranges.push(<CourseCard key={`${rawRule}-${code}`} code={code} />);
                      return;
                    }

                    // [A-Z]{4}[0-9]{4} (e.g. COMP1511) case
                    if (totalRules[rawRule].some((c) => c.code === code)) {
                      children.push(
                        <CourseCard key={`${rawRule}-${code}`} code={code} completed />
                      );
                      return;
                    }
                    children.push(<CourseCard key={`${rawRule}-${code}`} code={code} />);
                  });

                  if (rule.type === "DE")
                    children.push(
                      ...totalRules[rawRule].map((course) => (
                        <CourseCard
                          key={`${rawRule}-${JSON.stringify(course)}`}
                          code={course.code}
                          completed
                        />
                      ))
                    );

                  children.push(...ranges);

                  return (
                    <RequirementsBox
                      title={`${"program_rule_id" in rule ? "Program" : "Stream"} - ${rule.name}`}
                      uocCompleted={totalRules[rawRule].reduce(
                        (a, b) => a + parseInt(b.uoc, 10),
                        0
                      )}
                      minUoc={rule.min_uoc}
                      key={rawRule}>
                      {children}
                    </RequirementsBox>
                  );
                }

                // [A-Z]{4}[0-9]{4}([,;][A-Z]{4}[0-9]{4})* (COMP1511,MATH1131;MATH1141) case
                const children = [];
                rule.definition.split(",").forEach((code) => {
                  // exclusion code case (e.g. MATH1131;MATH1141)
                  if (new RegExp("^[A-Z]{4}[0-9]{4}(;[A-Z]{4}[0-9]{4})+$").test(code)) {
                    let exclusions = code.split(";");
                    let done;
                    // TODO: change this to find and fiddle with stuff below to maintain order
                    exclusions = exclusions.filter((exclusion) => {
                      if (totalRules[rawRule].some((c) => c.code === exclusion)) {
                        done = exclusion;
                        return false;
                      }
                      return true;
                    });
                    // if one of the courses has been completed
                    if (done) {
                      children.push(
                        <CourseCard
                          key={`${rawRule}-${done}`}
                          code={done}
                          completed
                          exclusionCourses={exclusions}
                        />
                      );
                      exclusions.forEach((e1) =>
                        children.push(
                          <CourseCard
                            key={`${rawRule}-${e1}`}
                            code={e1}
                            locked
                            exclusionCourses={exclusions.concat(done).filter((e2) => e2 !== e1)}
                          />
                        )
                      );
                      return;
                    }

                    // if none of the exclusion courses have been completed yet
                    exclusions.forEach((e1) =>
                      children.push(
                        <CourseCard
                          key={`${rawRule}-${e1}`}
                          code={e1}
                          exclusionCourses={exclusions.filter((e2) => e2 !== e1)}
                        />
                      )
                    );
                    return;
                  }

                  // single code case (e.g. COMP1511)
                  if (totalRules[rawRule].some((c) => c.code === code)) {
                    children.push(<CourseCard key={`${rawRule}-${code}`} code={code} completed />);
                    return;
                  }
                  children.push(<CourseCard key={`${rawRule}-${code}`} code={code} />);
                });

                return (
                  <RequirementsBox
                    title={`${"program_rule_id" in rule ? "Program" : "Stream"} - ${rule.name}`}
                    uocCompleted={totalRules[rawRule].reduce((a, b) => a + parseInt(b.uoc, 10), 0)}
                    minUoc={rule.min_uoc}
                    key={rawRule}>
                    {children}
                  </RequirementsBox>
                );
              }

              // general educations and free electives
              if (rule.type === "GE" || rule.type === "FE") {
                const children = totalRules[rawRule].map((course) => (
                  <CourseCard
                    key={`${rawRule}-${JSON.stringify(course)}`}
                    code={course.code}
                    completed
                  />
                ));
                return (
                  <RequirementsBox
                    title={`${"program_rule_id" in rule ? "Program" : "Stream"} - ${rule.name}`}
                    uocCompleted={totalRules[rawRule].reduce((a, b) => a + parseInt(b.uoc, 10), 0)}
                    minUoc={rule.min_uoc}
                    key={rawRule}>
                    {children}
                  </RequirementsBox>
                );
              }

              // courses not counted
              const children = totalRules[rawRule].map((course) => (
                <CourseCard
                  key={`${rawRule}-${JSON.stringify(course)}`}
                  code={course.code}
                  notCounted
                />
              ));
              return (
                <RequirementsBox title={`${rule.name}`} key={rawRule} notCounted>
                  {children}
                </RequirementsBox>
              );
            })
          )}
        </Box>
        {!programRulesIsLoading && !streamIsLoading && (
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
                  {/* change stream section */}
                  {!programStreamsIsLoading && (
                    <>
                      <SidebarButton title="Change stream" onClick={handleOpenChangeStream} />
                      <Modal
                        open={openChangeStream}
                        onClose={handleCloseChangeStream}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500
                        }}>
                        <Fade in={openChangeStream}>
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 500,
                              bgcolor: "background.paper",
                              border: "2px solid #000",
                              boxShadow: 24,
                              p: 4,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "centre"
                            }}>
                            <Autocomplete
                              value={changeStreamValue}
                              onChange={(event, newValue) => {
                                setChangeStreamValue(newValue);
                              }}
                              disablePortal
                              options={
                                programStreamsIsLoading
                                  ? []
                                  : programStreams
                                      .filter((s) => !(!!streamId && s.stream_id === streamId))
                                      .map((s) => {
                                        return { label: `${s.code} - ${s.title}`, id: s.stream_id };
                                      })
                              }
                              sx={{ width: 400 }}
                              // eslint-disable-next-line react/jsx-props-no-spreading
                              renderInput={(params) => <TextField {...params} label="Stream" />}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                            <Button
                              variant="contained"
                              css={css`
                                background-color: #4299e1;
                                margin-left: 10px;
                              `}
                              onClick={() => {
                                if (changeStreamValue === null) return;
                                setChangeStreamValue(null);
                                handleCloseChangeStream();
                              }}>
                              Change stream
                            </Button>
                          </Box>
                        </Fade>
                      </Modal>
                    </>
                  )}
                  {/* add course section */}
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
                        <Autocomplete
                          value={addValue}
                          onChange={(event, newValue) => {
                            setAddValue(newValue);
                          }}
                          disablePortal
                          options={
                            coursesIsLoading || !enrolments || "error" in enrolments
                              ? []
                              : courses
                                  .filter((c) =>
                                    enrolments
                                      .concat(addedCourses)
                                      .every(
                                        (e) =>
                                          (c.course_id !== e.course_id ||
                                            !["PS", "CR", "DN", "HD", "SY", "EC"].includes(
                                              e.grade
                                            )) &&
                                          !lockedCourses.includes(c.code)
                                      )
                                  )
                                  .map((c) => {
                                    return { label: c.code, id: c.course_id };
                                  })
                          }
                          sx={{ width: 300 }}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          renderInput={(params) => <TextField {...params} label="Course" />}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                        <Button
                          variant="contained"
                          css={css`
                            background-color: #4299e1;
                            margin-left: 10px;
                          `}
                          onClick={() => {
                            if (addValue === null) return;
                            const course = courses.find((c) => c.course_id === addValue.id);
                            setAddedCourses([
                              ...addedCourses,
                              ...[
                                {
                                  course_id: course.course_id,
                                  code: course.code,
                                  title: course.title,
                                  year: course.year,
                                  uoc: course.uoc,
                                  mark: "50",
                                  grade: "SY",
                                  is_ge: course.is_ge
                                }
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
                  {/* remove course section */}
                  {addedCourses.length !== 0 && (
                    <>
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
                            <Autocomplete
                              value={removeValue}
                              onChange={(event, newValue) => {
                                setRemoveValue(newValue);
                              }}
                              disablePortal
                              options={addedCourses.map((c) => {
                                return { label: c.code, id: c.course_id };
                              })}
                              sx={{ width: 300 }}
                              // eslint-disable-next-line react/jsx-props-no-spreading
                              renderInput={(params) => <TextField {...params} label="Course" />}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                            <Button
                              variant="contained"
                              css={css`
                                background-color: #4299e1;
                                margin-left: 10px;
                              `}
                              onClick={() => {
                                if (removeValue === null) return;
                                const newCourses = addedCourses.filter(
                                  (c) => c.course_id !== removeValue.id
                                );
                                setAddedCourses(newCourses);
                                setRemoveValue(null);
                                handleCloseRemove();
                              }}>
                              Remove course
                            </Button>
                          </Box>
                        </Fade>
                      </Modal>
                    </>
                  )}
                  <SidebarButton title="Reset modifiers" isRed onClick={resetModifiers} />
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
                    { name: "Stream", type: "ST" },
                    { name: "Core Courses", type: "CC" },
                    { name: "Discipline Electives", type: "DE" },
                    { name: "General Education", type: "GE" },
                    { name: "Free Electives", type: "FE" }
                  ].map(
                    ({ name, type }) =>
                      Object.keys(totalRules).some((rule) => JSON.parse(rule).type === type) && (
                        <SidebarItem
                          title={name}
                          completedUoc={getCompletedUoc(type)}
                          totalUoc={getTotalUoc(type)}
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
