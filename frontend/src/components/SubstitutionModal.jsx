/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useContext } from "react";

import { useMutation } from "@tanstack/react-query";

import { Modal, TextField, Autocomplete, Button, Fade, Box, Backdrop } from "@mui/material";

import PropTypes from "prop-types";

import { StudentContext } from "../helpers/StudentContext";

const SubstitutionModal = ({ open, handleClose, refetchSubstitutions, options }) => {
  const { studentState } = useContext(StudentContext);

  const [origCourse, setOrigCourse] = useState(null);
  const [subCourse, setSubCourse] = useState(null);

  const sendSubMutation = useMutation((zid) => {
    console.log(zid, origCourse.id, subCourse.id);
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        zid,
        orig: origCourse.id,
        sub: subCourse.id
      })
    };
    return fetch("http://127.0.0.1:5000/substitution", requestOptions).then((res) => res.json());
  });

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
            gap: "10px",
            justifyContent: "space-between",
            alignItems: "centre"
          }}>
          <Autocomplete
            value={origCourse}
            onChange={(event, newValue) => {
              setOrigCourse(newValue);
            }}
            disablePortal
            options={options}
            sx={{ width: 400 }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            renderInput={(params) => <TextField {...params} label="Original course" />}
            isOptionEqualToValue={(option, value) => option.code === value.code}
          />
          <Autocomplete
            value={subCourse}
            onChange={(event, newValue) => {
              setSubCourse(newValue);
            }}
            disablePortal
            options={options}
            sx={{ width: 400 }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            renderInput={(params) => <TextField {...params} label="Substitution course" />}
            isOptionEqualToValue={(option, value) => option.code === value.code}
          />
          <Button
            variant="contained"
            css={css`
              background-color: #4299e1;
              margin-left: 10px;
            `}
            onClick={async () => {
              if (origCourse === null || subCourse === null) return;
              await sendSubMutation.mutateAsync(studentState.zId);
              setOrigCourse(null);
              setSubCourse(null);
              handleClose();
              refetchSubstitutions();
            }}>
            APPROVE SUBSTITUTION
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

SubstitutionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetchSubstitutions: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
};

SubstitutionModal.defaultProps = {};

export default SubstitutionModal;
