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
    if (!userState) {
      navigate("/login");
    }
  }, []);

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
          {
            programRulesIsLoading || streamIsLoading ? (
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
                        const children =
                          rule[3] === null ? (
                            <></>
                          ) : (
                            rule[3].split(",").map((code) => {
                              const course = enrolments.enrolments.find((e) => e[1] === code);
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
                            })
                          );
                        return (
                          <RequirementsBox
                            title={rule[1]}
                            uocCompleted={uocCompleted}
                            minUoc={rule[2]}
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
                      title={prule[1]}
                      uocCompleted={0}
                      minUoc={prule[3]}>
                      {children}
                    </RequirementsBox>
                  );
                }
                return (
                  <RequirementsBox
                    key={prule[0]}
                    title={prule[1]}
                    uocCompleted={0}
                    minUoc={prule[3]}
                  />
                );
              })
            )
            // (
            //   <>
            //     {streamRulesIsLoading ? (
            //       <></>
            //     ) : (
            //       streamRules.stream_rules.map((rule) => {
            //         let uocCompleted = 0;
            //         const children =
            //           rule[3] === null ? (
            //             <></>
            //           ) : (
            //             rule[3].split(",").map((code) => {
            //               const course = enrolments.enrolments.find((e) => e[1] === code);
            //               if (course === undefined) {
            //                 return <CourseCard key={code} code={code} completed={false} />;
            //               }
            //               const completed =
            //                 course[1] === code &&
            //                 ["PS", "CR", "DN", "HD", "SY", "EC"].includes(course[6]);
            //               if (completed) {
            //                 uocCompleted += parseInt(course[4], 10);
            //               }
            //               return <CourseCard key={code} code={code} completed={completed} />;
            //             })
            //           );
            //         return (
            //           <RequirementsBox
            //             title={rule[1]}
            //             uocCompleted={uocCompleted}
            //             minUoc={rule[2]}
            //             key={rule[0]}>
            //             {children}
            //           </RequirementsBox>
            //         );
            //       })
            //     )}
            //   </>
            // )
          }
        </Box>
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
              border-width: 0px 0px 0px 1px;
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
                <ListItemButton
                  sx={{ pl: 4 }}
                  css={css`
                    border-style: solid;
                    border-color: #bfbfbf;
                    border-width: 1px 0px 0px 0px;
                    padding: 8px 16px;
                    background-color: white;
                  `}>
                  <ListItemText primary="Discipline Component" />
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
                  <ListItemText primary="Discipline Electives" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  css={css`
                    border-style: solid;
                    border-color: #bfbfbf;
                    border-width: 1px 0px;
                    padding: 8px 16px;
                    background-color: white;
                  `}>
                  <ListItemText primary="General Education" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Box>
      </Box>
    </div>
  );
};

export default CheckerPage;
