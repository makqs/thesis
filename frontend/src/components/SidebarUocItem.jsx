/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import { ListItem, ListItemText } from "@mui/material";
import PropTypes from "prop-types";

const SidebarUocItem = ({ title, completedUoc, totalUoc }) => {
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
      <ListItemText primary={title} />
      <ListItemText
        primary={`${completedUoc} / ${totalUoc}`}
        css={css`
          text-align: right;
        `}
      />
    </ListItem>
  );
};

SidebarUocItem.propTypes = {
  title: PropTypes.string.isRequired,
  completedUoc: PropTypes.number.isRequired,
  totalUoc: PropTypes.number.isRequired
};

SidebarUocItem.defaultProps = {};

export default SidebarUocItem;
