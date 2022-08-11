/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useContext, useState, useEffect } from "react";
import { Box } from "@mui/material";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NavBar from "../components/NavBar";
import RequirementsBox from "../components/RequirementsBox";
import CourseCard from "../components/CourseCard";
import { UserContext } from "../helpers/UserContext";
import SidebarElement from "../components/SidebarElement";

const CheckerPage = () => {
  const navigate = useNavigate();
  const { userState } = useContext(UserContext);

  const { data: enrolments, isLoading: enrolmentsIsLoading } = useQuery(
    [userState, "enrolmentsData"],
    () => {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          zid: userState.zId
        })
      };
      return fetch("http://127.0.0.1:5000/user/enrolments", requestOptions).then((res) =>
        res.json()
      );
    }
  );
  console.log(enrolments, enrolmentsIsLoading);

  const { data: program, isLoading: programIsLoading } = useQuery(
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
  const { data: programRules, isLoading: programRulesIsLoading } = useQuery(
    [program, "programRulesData"],
    () => {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          program_id: program.program_id
        })
      };
      return fetch("http://127.0.0.1:5000/user/program/rules", requestOptions).then((res) =>
        res.json()
      );
    }
  );
  console.log(program, programIsLoading, programRules, programRulesIsLoading);

  const { data: stream, isLoading: streamIsLoading } = useQuery([userState, "streamData"], () => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        zid: userState.zId
      })
    };
    return fetch("http://127.0.0.1:5000/user/stream", requestOptions).then((res) => res.json());
  });
  const {
    data: streamRules,
    isLoading: streamRulesIsLoading,
    refetch: streamRulesRefetch
  } = useQuery(
    [stream, "streamRulesData"],
    () => {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          stream_id: stream.stream_id
        })
      };
      return fetch("http://127.0.0.1:5000/user/stream/rules", requestOptions).then((res) =>
        res.json()
      );
    },
    { enabled: false }
  );
  useEffect(() => {
    if (stream !== undefined && "stream_id" in stream) streamRulesRefetch();
  }, [stream]);
  console.log(stream, streamIsLoading, streamRules, streamRulesIsLoading);

  const [modsOpen, setModsOpen] = useState(true);
  const handleModsClick = () => {
    setModsOpen(!modsOpen);
  };

  const [uocOpen, setUocOpen] = useState(true);
  const handleUocClick = () => {
    setUocOpen(!uocOpen);
  };

  useEffect(() => {
    if (!userState) navigate("/login");
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
    if (!enrolmentsIsLoading && !programRulesIsLoading && !streamRulesIsLoading) {
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

      enrolments.enrolments.forEach((e) => {
        if (["PS", "CR", "DN", "HD", "SY", "EC"].includes(e[6])) {
          if (
            allRules.some((rule) => {
              return rule[2] === "CC" && rule[4].split(",").includes(e[1]);
            })
          ) {
            coreList.push(e);
            return;
          }

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

          if (e[7] === "True") {
            genEdList.push(e);
            return;
          }

          freeElecList.push(e);
        }
      });

      setCores(coreList);
      setDisciplineElectives(discElecList);
      setGenEds(genEdList);
      setFreeElectives(freeElecList);

      console.log(cores, disciplineElectives, genEds, freeElectives);
    }
  }, [enrolments, programRules, streamRules]);

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
                  return streamRulesIsLoading ? (
                    <></>
                  ) : (
                    streamRules.stream_rules.map((rule) => {
                      let uocCompleted = 0;
                      let children = [];

                      if (rule[2] === "CC") {
                        children = rule[4].split(",").map((code) => {
                          const course = cores.find((e) => e[1] === code);
                          if (course === undefined) {
                            return <CourseCard key={code} code={code} completed={false} />;
                          }
                          const completed =
                            course[1] === code &&
                            ["PS", "CR", "DN", "HD", "SY", "EC"].includes(course[6]);
                          if (completed) {
                            uocCompleted += parseInt(course[4], 10);
                          }
                          return <CourseCard key={code} code={code} completed={completed} />;
                        });
                      } else if (rule[2] === "DE") {
                        const ranges = [];
                        rule[4].split(",").forEach((code) => {
                          if (new RegExp("^[A-Z]{4}[0-9]{4}$").test(code)) {
                            const course = disciplineElectives.find((e) => e[1] === code);
                            if (course === undefined) {
                              children.push(
                                <CourseCard key={code} code={code} completed={false} />
                              );
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
                                const completed = ["PS", "CR", "DN", "HD", "SY", "EC"].includes(
                                  c[6]
                                );
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
                    })
                  );
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
                  {/* {["Change program", "Add course", "Remove course"].map((title) => (
                  <ListItemButton
                    key={title}
                    sx={{ pl: 4 }}
                    css={css`
                      border-style: solid;
                      border-color: #bfbfbf;
                      border-width: 1px 0px 0px 0px;
                      padding: 8px 16px;
                      background-color: white;
                    `}>
                    <ListItemText primary={title} />
                  </ListItemButton>
                ))} */}
                  <ListItemButton
                    sx={{ pl: 4 }}
                    css={css`
                      border-style: solid;
                      border-color: #bfbfbf;
                      border-width: 1px 0px 0px 0px;
                      padding: 8px 16px;
                      background-color: white;
                    `}>
                    <ListItemText primary="Change program" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    css={css`
                      border-style: solid;
                      border-color: #bfbfbf;
                      border-width: 1px 0px 0px 0px;
                      padding: 8px 16px;
                      background-color: white;
                    `}>
                    <ListItemText primary="Add course" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    css={css`
                      border-style: solid;
                      border-color: #bfbfbf;
                      border-width: 1px 0px 0px 0px;
                      padding: 8px 16px;
                      background-color: white;
                    `}>
                    <ListItemText primary="Remove course" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    css={css`
                      background-color: #f18787;
                      color: white;
                      &:hover {
                        background-color: #f16565;
                      }
                      border-style: solid;
                      border-color: #bfbfbf;
                      border-width: 1px 0px 0px 0px;
                      padding: 8px 16px;
                    `}>
                    <ListItemText primary="Reset modifiers" />
                  </ListItemButton>
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
                {uocOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={uocOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <SidebarElement
                    title="Cores"
                    completedUoc={cores.map((c) => parseInt(c[4], 10)).reduce((a, b) => a + b, 0)}
                    totalUoc={totalCoreUoc}
                  />
                  <SidebarElement
                    title="Discipline Electives"
                    completedUoc={disciplineElectives
                      .map((c) => parseInt(c[4], 10))
                      .reduce((a, b) => a + b, 0)}
                    totalUoc={totalDiscUoc}
                  />
                  <SidebarElement
                    title="General Education"
                    completedUoc={genEds.map((c) => parseInt(c[4], 10)).reduce((a, b) => a + b, 0)}
                    totalUoc={totalGenedUoc}
                  />
                  <SidebarElement
                    title="Free Electives"
                    completedUoc={freeElectives
                      .map((c) => parseInt(c[4], 10))
                      .reduce((a, b) => a + b, 0)}
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
