/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import { Card, CardActionArea, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

import InfoIcon from "@mui/icons-material/Info";

const CourseCard = ({ code, completed, notCounted, locked, exclusionCourses, isStream }) => {
  const { data: course, isLoading } = useQuery(
    [code],
    () => {
      const requestOptions = {
        method: "GET"
      };
      return fetch(`http://127.0.0.1:5000/course?code=${code}`, requestOptions).then((res) =>
        res.json()
      );
    },
    { enabled: new RegExp("^[A-Z]{4}[0-9]{4}$").test(code) }
  );

  let bgColor = "#f7fafc";
  let textColor = "#646c7d";
  if (completed) {
    bgColor = "#71ad7b";
    textColor = "#ffffff";
  }
  if (locked) {
    bgColor = "#b6b6b6";
    textColor = "#ffffff";
  }
  if (notCounted) {
    bgColor = "#f6c43c";
    textColor = "#ffffff";
  }

  const children = (
    <>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}>
        <div>{code}</div>
        <div>{isLoading ? "..." : course.uoc} UOC</div>
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        `}>
        <div
          css={css`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `}>
          {isLoading ? "..." : course.title}
        </div>
        {exclusionCourses.length !== 0 && (
          <Tooltip
            title={`Exclusion course of ${exclusionCourses.join(", ")}`}
            css={css`
              cursor: pointer;
            `}>
            <InfoIcon
              css={css`
                height: max-content;
              `}
            />
          </Tooltip>
        )}
      </div>
    </>
  );

  let cardVariety;
  if (isStream) {
    cardVariety = (
      <a
        href={`https://www.handbook.unsw.edu.au/undergraduate/specialisations/2021/${code}`}
        target="blank_"
        css={css`
          color: inherit;
          font-size: inherit;
          text-decoration: inherit;
          cursor: inherit;
        `}>
        <CardActionArea
          css={css`
            font-size: 13pt;
            padding: 8px;
            display: flex;
            justify-content: center;
            width: 100%;
            height: 100%;
            cursor: inherit;
          `}>
          {code}
        </CardActionArea>
      </a>
    );
  } else if (isLoading || new RegExp("^[A-Z]{4}[0-9]X{3}$").test(code)) {
    cardVariety = (
      <Tooltip title={isStream ? `` : `Any level ${code[4]} ${code.slice(0, 4)} course`}>
        <CardActionArea
          css={css`
            font-size: 13pt;
            padding: 8px;
            display: flex;
            justify-content: center;
            width: 100%;
            height: 100%;
            cursor: default;
          `}>
          {code}
        </CardActionArea>
      </Tooltip>
    );
  } else {
    cardVariety = (
      <CardActionArea
        css={css`
          font-size: 13pt;
          padding: 8px;
          cursor: inherit;
        `}>
        {locked ? (
          children
        ) : (
          <a
            // TODO: get working with postgraduate, hardcoded to undergraduate atm
            href={
              isLoading
                ? "https://www.handbook.unsw.edu.au/"
                : `https://www.handbook.unsw.edu.au/undergraduate/courses/${course.year}/${code}`
            }
            target="blank_"
            css={css`
              color: inherit;
              font-size: inherit;
              text-decoration: inherit;
              cursor: inherit;
            `}>
            {children}
          </a>
        )}
      </CardActionArea>
    );
  }
  return (
    <Card
      css={css`
        border: 1px solid grey;
        flex: 0 0 calc(25% - 2px - (10px * 3 / 4));
        @media (max-width: 1000px) {
          flex: 0 0 calc(50% - 2px - (10px * 1 / 2));
        }
        @media (min-width: 1000px) and (max-width: 1500px) {
          flex: 0 0 calc((100% / 3) - 2px - (10px * 2 / 3));
        }
        border-radius: 10px;
        border: 1px solid #b6b6b6;
        color: ${textColor};
        background-color: ${bgColor};
        box-shadow: 0px;
        cursor: ${locked ? "not-allowed" : "pointer"};
      `}>
      {cardVariety}
    </Card>
  );
};

CourseCard.propTypes = {
  code: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  notCounted: PropTypes.bool,
  locked: PropTypes.bool,
  exclusionCourses: PropTypes.arrayOf(PropTypes.string),
  isStream: PropTypes.bool
};

CourseCard.defaultProps = {
  completed: false,
  notCounted: false,
  locked: false,
  exclusionCourses: [],
  isStream: false
};

export default CourseCard;
