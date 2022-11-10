/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import { ListItem, ListItemText } from "@mui/material";
import PropTypes from "prop-types";

const SidebarWamItem = ({ wam }) => {
  let grade;
  if (wam < 50) grade = "FL";
  else if (wam < 65) grade = "PS";
  else if (wam < 75) grade = "CR";
  else if (wam < 85) grade = "DN";
  else grade = "HD";
  return (
    <ListItem
      sx={{ pl: 4 }}
      css={css`
        border-style: solid;
        border-color: #bfbfbf;
        border-width: 1px 0px 0px 0px;
        padding: 8px 16px;
        background-color: white;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      `}>
      <ListItemText primary={(Math.round(wam * 100) / 100).toFixed(2)} />
      <ListItemText
        primary={grade}
        css={css`
          text-align: right;
        `}
      />
    </ListItem>
  );
};

SidebarWamItem.propTypes = {
  wam: PropTypes.number.isRequired
};

SidebarWamItem.defaultProps = {};

export default SidebarWamItem;
