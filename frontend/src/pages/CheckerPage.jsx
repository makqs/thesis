/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState } from "react";
import { Box } from "@mui/material";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import RequirementsBox from "../components/RequirementsBox";
import NavBar from "../components/NavBar";
import CourseCard from "../components/CourseCard";

const CheckerPage = () => {
  const [modsOpen, setModsOpen] = useState(true);
  const handleModsClick = () => {
    setModsOpen(!modsOpen);
  };

  const [uocOpen, setUocOpen] = useState(true);
  const handleUocClick = () => {
    setUocOpen(!uocOpen);
  };

  return (
    <>
      <NavBar />
      <Box
        css={css`
          display: flex;
          flex-direction: row;
          height: 100%;
        `}>
        {/* <Box
          css={css`
            background-color: red;
            flex-grow: 1;
            height: 100%;
          `}
        >
          thing
        </Box> */}
        <Box
          css={css`
            flex-grow: 1;
            height: 100%;
            margin: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}>
          <RequirementsBox title="Level 1 Cores">
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
          </RequirementsBox>
          <RequirementsBox title="Level 2 Cores">
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
        </Box>
        <Box
          css={css`
            background-color: #f7fafc;
            width: 350px;
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
                  `}>
                  <ListItemText primary="General Education" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          {/* <Accordion
            expanded={expanded === "modifiers"}
            onChange={handleChange("modifiers")}
            disableGutters
            square
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="modifiers-accordion"
              id="modifiers-header"
            >
              <Typography>General settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem disablePadding disableGutters>
                  <ListItemButton>
                    <ListItemText primary="Add course" />
                  </ListItemButton>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion> */}
        </Box>
      </Box>
    </>
  );
};

export default CheckerPage;
