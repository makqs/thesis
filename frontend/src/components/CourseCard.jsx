/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import { Card, CardActionArea } from "@mui/material";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

const CourseCard = ({ code, completed }) => {
  const { data, isLoading, status } = useQuery(
    [code],
    () => {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          code
        })
      };
      return fetch("http://127.0.0.1:5000/course", requestOptions).then((res) => res.json());
    },
    { enabled: new RegExp("^[A-Z]{4}[0-9]{4}$").test(code) }
  );

  console.log(code, status);

  const completionColor = completed ? "#52b96a" : "#f7fafc";
  const textColor = completed ? "#ffffff" : "#646c7d";

  return (
    <Card
      css={css`
        border: 1px solid grey;
        width: 32%;
        @media (max-width: 1000px) {
          width: 49%;
        }
        border-radius: 5px;
        border: 1px solid #b6b6b6;
        color: ${textColor};
        background-color: ${completionColor};
        box-shadow: 0px;
      `}>
      {isLoading ? (
        <CardActionArea
          css={css`
            font-size: 13pt;
            padding: 8px;
            display: flex;
            justify-content: center;
          `}>
          {code}
        </CardActionArea>
      ) : (
        <a
          // TODO: get working with postgraduate, hardcoded to undergraduate atm
          href={
            isLoading
              ? "https://www.handbook.unsw.edu.au/"
              : `https://www.handbook.unsw.edu.au/undergraduate/courses/${data.course_info[3]}/${code}`
          }
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
              <div>{isLoading ? "..." : data.course_info[4]} UOC</div>
            </div>
            <div
              css={css`
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}>
              {isLoading ? "..." : data.course_info[2]}
            </div>
          </CardActionArea>
        </a>
      )}
    </Card>
  );
};

CourseCard.propTypes = {
  code: PropTypes.string.isRequired,
  completed: PropTypes.bool
};

CourseCard.defaultProps = {
  completed: false
};

export default CourseCard;
