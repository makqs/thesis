/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import { Card, CardActionArea } from "@mui/material";
import PropTypes from "prop-types";

const CourseCard = ({ code, title, uoc, completed }) => {
  const completionColor = completed ? "#52b96a" : "#f7fafc";
  const textColor = completed ? "#ffffff" : "#646c7d";
  return (
    <Card
      css={css`
        border: 1px solid grey;
        width: 32%;
        border-radius: 5px;
        border: 1px solid #b6b6b6;
        color: ${textColor};
        background-color: ${completionColor};
        box-shadow: 0px;
      `}>
      <a
        // TODO: get working with postgraduate, hardcoded to undergraduate atm
        href={`https://www.handbook.unsw.edu.au/undergraduate/courses/2022/${code}`}
        target="blank_"
        css={css`
          color: inherit;
          font-size: inherit;
          text-decoration: inherit;
        `}>
        <CardActionArea
          css={css`
            font-size: 13pt;
            padding: 8px;
          `}>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
            `}>
            <div>{code}</div>
            <div>{uoc} UOC</div>
          </div>
          <div
            css={css`
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            `}>
            {title}
          </div>
        </CardActionArea>
      </a>
    </Card>
  );
};

CourseCard.propTypes = {
  code: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  uoc: PropTypes.number.isRequired,
  completed: PropTypes.bool
};

CourseCard.defaultProps = {
  completed: false
};

export default CourseCard;
