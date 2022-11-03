/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

import { Modal, TextField, Autocomplete, Button, Fade, Box, Backdrop } from "@mui/material";

import PropTypes from "prop-types";

const AddCourseModal = ({
  open,
  handleClose,
  selectedCourse,
  setSelectedCourse,
  options,
  doneFunc
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "centre"
          }}>
          <Autocomplete
            value={selectedCourse}
            onChange={(event, newValue) => {
              setSelectedCourse(newValue);
            }}
            disablePortal
            options={options}
            sx={{ width: 300 }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            renderInput={(params) => <TextField {...params} label="Course" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Button
            variant="contained"
            css={css`
              background-color: #4299e1;
              margin-left: 10px;
            `}
            onClick={doneFunc}>
            Add course
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

AddCourseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedCourse: PropTypes.objectOf(PropTypes.string),
  setSelectedCourse: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  doneFunc: PropTypes.func.isRequired
};

AddCourseModal.defaultProps = {
  selectedCourse: null
};

export default AddCourseModal;
