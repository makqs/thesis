/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import { ListItem, ListItemText } from "@mui/material";
import PropTypes from "prop-types";

const SidebarItem = ({ title, completedUoc, totalUoc }) => {
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
      {completedUoc !== null && totalUoc !== null && (
        <ListItemText
          primary={`${completedUoc} / ${totalUoc}`}
          css={css`
            text-align: right;
          `}
        />
      )}
    </ListItem>
  );
};

SidebarItem.propTypes = {
  title: PropTypes.string.isRequired,
  completedUoc: PropTypes.number,
  totalUoc: PropTypes.number
};

SidebarItem.defaultProps = {
  completedUoc: null,
  totalUoc: null
};

export default SidebarItem;
