/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import PropTypes from "prop-types";

const RequirementsBox = ({ title, uocCompleted, minUoc, notCounted, children }) => {
  return (
    <Card
      css={css`
        border: 1px solid #b6b6b6;
        border-radius: 10px;
        flex: none;
      `}>
      <CardHeader
        title={
          <div
            css={css`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            `}>
            <div>{title}</div>
            {notCounted ? (
              <Tooltip title="These courses do not towards your progression">
                <InfoIcon
                  css={css`
                    width: 20px;
                  `}
                />
              </Tooltip>
            ) : (
              <div>
                {uocCompleted} / {minUoc}
              </div>
            )}
          </div>
        }
        css={css`
          background-color: #f3f3f3;
          color: #646c7d;
          border-style: solid;
          border-color: #b6b6b6;
          border-width: 0px 0px 1px 0px;
          padding: 8px 16px;
        `}
      />
      <CardContent
        css={css`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px 0;
          padding: 10px;
          &:last-child {
            padding-bottom: 10px;
          }
        `}>
        {children}
      </CardContent>
    </Card>
  );
};

RequirementsBox.propTypes = {
  title: PropTypes.string.isRequired,
  uocCompleted: PropTypes.number,
  minUoc: PropTypes.string,
  notCounted: PropTypes.bool,
  children: PropTypes.node
};

RequirementsBox.defaultProps = {
  uocCompleted: null,
  minUoc: null,
  notCounted: false,
  children: null
};

export default RequirementsBox;
