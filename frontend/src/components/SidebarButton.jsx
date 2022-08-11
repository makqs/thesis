/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import { ListItemButton, ListItemText } from "@mui/material";
import PropTypes from "prop-types";

const SidebarItem = ({ title, isRed, onClick }) => {
  return (
    <ListItemButton
      sx={{ pl: 4 }}
      onClick={onClick}
      css={css`
        border-style: solid;
        border-color: #bfbfbf;
        border-width: 1px 0px 0px 0px;
        padding: 8px 16px;
        background-color: ${isRed ? "#f18787" : "white"};
        ${isRed &&
        `color: white;
        &:hover {
          background-color: #f16565;
        }`};
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      `}>
      <ListItemText primary={title} />
    </ListItemButton>
  );
};

SidebarItem.propTypes = {
  title: PropTypes.string.isRequired,
  isRed: PropTypes.bool,
  onClick: PropTypes.func
};

SidebarItem.defaultProps = {
  isRed: false,
  onClick: () => {}
};

export default SidebarItem;
