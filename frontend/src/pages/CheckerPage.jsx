/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState } from "react";
import { Box } from "@mui/material";

import NavBar from "../components/NavBar";

// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Divider from "@mui/material/Divider";
// import InboxIcon from "@mui/icons-material/Inbox";
// import DraftsIcon from "@mui/icons-material/Drafts";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const CheckerPage = () => {
  // const [expanded, setExpanded] = useState(false);

  // const handleChange = (panel) => (event, isExpanded) => {
  //   setExpanded(isExpanded ? panel : false);
  // };

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
      <NavBar></NavBar>
      <Box
        css={css`
          background-color: green;
          display: flex;
          flex-direction: row;
          height: 100%;
        `}
      >
        <Box
          css={css`
            background-color: red;
            flex-grow: 1;
            height: 100%;
          `}
        >
          thing
        </Box>
        <Box
          css={css`
            background-color: white;
            width: 350px;
          `}
        >
          <List
            css={css`
              width: 100%;
              padding-top: 0;
            `}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              onClick={handleModsClick}
              css={css`
                background-color: #f3f3f3;
              `}
            >
              <ListItemText primary="Modifiers" />
              {modsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={modsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Change program" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Add course" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Remove course" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Reset modifiers" />
                </ListItemButton>
              </List>
            </Collapse>
            <ListItemButton
              onClick={handleUocClick}
              css={css`
                background-color: #f3f3f3;
              `}
            >
              <ListItemText primary="UOC" />
              {uocOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={uocOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Discipline Component" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText
                    primary="Discipline Electives"
                    secondary="hmm?"
                  />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
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
