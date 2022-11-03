/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useContext } from "react";

import { Modal, TextField, Autocomplete, Button, Fade, Box, Backdrop } from "@mui/material";

import PropTypes from "prop-types";

import { StudentContext } from "../helpers/StudentContext";

const ChangeStreamModal = ({ open, handleClose, selectedStream, setSelectedStream, options }) => {
  const { studentDispatch } = useContext(StudentContext);
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
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "centre"
          }}>
          <Autocomplete
            value={selectedStream}
            onChange={(event, newValue) => {
              setSelectedStream(newValue);
            }}
            disablePortal
            options={options}
            sx={{ width: 400 }}
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
            onClick={() => {
              if (selectedStream === null) return;
              studentDispatch({ type: "updateStream", tempStreamId: selectedStream.id });
              setSelectedStream(null);
              handleClose();
            }}>
            Change stream
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

ChangeStreamModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedStream: PropTypes.objectOf(PropTypes.string),
  setSelectedStream: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
};

ChangeStreamModal.defaultProps = {
  selectedStream: null
};

export default ChangeStreamModal;
