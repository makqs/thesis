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

// import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";
import RequirementsBox from "../components/RequirementsBox";
import NavBar from "../components/NavBar";
import CourseCard from "../components/CourseCard";
import { UserContext } from "../helpers/UserContext";
import { fetchWrapper } from "../helpers/Wrapper";

const CheckerPage = () => {
  console.log("IM RENDERING");
  const navigate = useNavigate();
  const { userState } = useContext(UserContext);

  // const [courses, setCourses] = useState([]);
  // console.log(courses);

  // const getCourses = async () => {
  //   const courseData = await fetchWrapper("GET", "/courses", null, null);
  //   setCourses(courseData.courses);
  // };

  const [program, setProgram] = useState(null);
  const [stream, setStream] = useState(null);
  const [programRules, setProgramRules] = useState([]);
  const [streamRules, setStreamRules] = useState([]);

  const getProgramRules = async (id) => {
    const programData = await fetchWrapper("POST", "/user/program", null, { zid: id });
    setProgram(programData);
    const programRulesData = await fetchWrapper("POST", "/user/program/rules", null, {
      program_id: programData.program_id
    });
    setProgramRules(programRulesData.program_rules);
  };
  console.log(program, programRules);

  const getStreamRules = async (id) => {
    const streamData = await fetchWrapper("POST", "/user/stream", null, { zid: id });
    setStream(streamData);
    const streamRulesData = await fetchWrapper("POST", "/user/stream/rules", null, {
      stream_id: streamData.stream_id
    });
    setStreamRules(streamRulesData.stream_rules);
  };
  console.log(stream, streamRules);

  const [enrolments, setEnrolments] = useState([]);
  const getEnrolments = async (id) => {
    const enrolmentData = await fetchWrapper("POST", "/user/enrolments", null, { zid: id });
    setEnrolments(enrolmentData.enrolments);
    console.log(enrolmentData.enrolments);
  };
  console.log(enrolments, setEnrolments);

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
    // getCourses();
  }, []);

  useEffect(() => {
    getProgramRules(userState.zId);
    getStreamRules(userState.zId);
    getEnrolments(userState.zId);
  }, [userState]);

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
          {streamRules.map((rule) => {
            let uocCompleted = 0;
            const children = rule[3].split(",").map((code) => {
              const course = enrolments.find((e) => e[1] === code);
              if (course === undefined) {
                return <CourseCard key={code} code={code} completed={false} />;
              }
              const completed =
                course[1] === code && ["PS", "CR", "DN", "HD", "SY", "EC"].includes(course[6]);
              if (completed) {
                uocCompleted += parseInt(course[4], 10);
              }
              return <CourseCard key={code} code={code} completed={completed} />;
            });
            return (
              <RequirementsBox
                title={rule[1]}
                uocCompleted={uocCompleted}
                minUoc={rule[2]}
                key={rule[0]}>
                {children}
              </RequirementsBox>
            );
          })}
          {/* <RequirementsBox title="NOT ACTUAL THING">
            <CourseCard code="COMP1511" title="Programming Fundamentals" uoc={6} completed />
            <CourseCard code="COMP1521" title="Computer Systems Fundamentals" uoc={6} />
            <CourseCard
              code="COMP1531"
              title="Software Engineering Fundamentals"
              uoc={6}
              completed
            />
            <CourseCard
              code="DESN1000"
              title="Introduction to Engineering Design and Innovation"
              uoc={6}
            />
            <CourseCard code="MATH1131" title="Mathematics 1A" uoc={6} />
            <CourseCard code="MATH1231" title="Mathematics 1B" uoc={6} />
            <CourseCard code="MATH1081" title="Discrete Mathematics" uoc={6} />
          </RequirementsBox> */}
          {/* <RequirementsBox title="Level 2 Cores">
            <CourseCard
              code="COMP2041"
              title="Software Construction: Techniques and Tools"
              uoc={6}
              completed
            />
            <CourseCard code="COMP2511" title="Object-Oriented Design & Programming" uoc={6} />
            <CourseCard code="COMP2521" title="Data Structures and Algorithms" uoc={6} completed />
            <CourseCard
              code="DESN2000"
              title="Engineering Design and Professional Practice"
              uoc={6}
            />
            <CourseCard code="MATH2400" title="Finite Mathematics" uoc={3} />
            <CourseCard
              code="MATH2859"
              title="Probability, Statistics and Information"
              uoc={3}
              completed
            />
            <CourseCard
              code="SENG2011"
              title="Workshop on Reasoning about Programs"
              uoc={6}
              completed
            />
            <CourseCard code="SENG2021" title="Requirements and Design Workshop" uoc={6} />
          </RequirementsBox>
          <RequirementsBox title="blah" />
          <RequirementsBox title="blah" />
          <RequirementsBox title="blah" />
          <RequirementsBox title="blah" />
          <RequirementsBox title="blah" /> */}
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

// CheckerPage.propTypes = {
//   zId: PropTypes.string.isRequired,
//   name: PropTypes.string
// };

// CheckerPage.defaultProps = {
//   name: "no name"
// };

export default CheckerPage;
