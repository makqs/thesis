/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

import { Collapse, IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import PropTypes from "prop-types";
import { ExpandMore } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RequirementsBox = ({
  title,
  uocCompleted,
  minUoc,
  notCounted,
  numToComplete,
  numCompleted,
  children
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card
      sx={{ boxShadow: 3 }}
      css={css`
        border: 1px solid #b6b6b6;
        border-radius: 3px;
        flex: none;
      `}>
      <CardHeader
        title={
          <div
            css={css`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              font-size: 1.3rem;
            `}>
            <div>{title}</div>
            <div
              css={css`
                display: flex;
                flex-direction: row;
                gap: 5px;
              `}>
              {notCounted ? (
                <Tooltip
                  title={`${
                    children.length > 1 ? "These courses do" : "This course does"
                  } not count towards your progression`}
                  css={css`
                    cursor: pointer;
                    margin: auto;
                  `}>
                  <InfoIcon
                    css={css`
                      height: fit-content;
                    `}
                  />
                </Tooltip>
              ) : (
                <div
                  css={css`
                    margin: auto;
                  `}>
                  {numToComplete !== "None"
                    ? `${numCompleted} / ${parseInt(numToComplete, 10)} Course${
                        numToComplete > 1 ? "s" : ""
                      }`
                    : `${uocCompleted} / ${minUoc} UOC`}
                </div>
              )}
              {!notCounted && (
                <CheckCircleIcon
                  css={css`
                    margin: auto;
                    visibility: ${(uocCompleted !== "None" && uocCompleted < minUoc) ||
                    (numToComplete !== "None" &&
                      parseInt(numCompleted, 10) < parseInt(numToComplete, 10))
                      ? "hidden"
                      : "auto"};
                  `}
                  style={{ color: "#71ad7b" }}
                />
              )}
              <IconButton onClick={handleExpandClick}>
                <ExpandMore
                  expand={expanded.toString()}
                  aria-expanded={expanded}
                  aria-label="show more"
                  css={css`
                    transform: ${expanded && expanded ? "rotate(180deg)" : "rotate(0deg)"};
                    margin-left: "auto";
                    transition: 0.2s;
                  `}>
                  <ExpandMoreIcon />
                </ExpandMore>
              </IconButton>
            </div>
          </div>
        }
        css={css`
          background-color: #f3f3f3;
          color: #646c7d;
          border-style: solid;
          border-color: #b6b6b6;
          border-width: 0px 0px 1px 0px;
          padding: 8px 5px 8px 16px;
        `}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          css={css`
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            gap: 20px 20px;
            padding: 20px;
          `}>
          {children}
        </CardContent>
      </Collapse>
    </Card>
  );
};

RequirementsBox.propTypes = {
  title: PropTypes.string.isRequired,
  uocCompleted: PropTypes.number,
  minUoc: PropTypes.string,
  notCounted: PropTypes.bool,
  numToComplete: PropTypes.string,
  numCompleted: PropTypes.number,
  children: PropTypes.node
};

RequirementsBox.defaultProps = {
  uocCompleted: null,
  minUoc: null,
  notCounted: false,
  numToComplete: null,
  numCompleted: 0,
  children: null
};

export default RequirementsBox;
