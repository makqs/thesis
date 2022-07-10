/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useContext, useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

import { useNavigate } from "react-router-dom";

import { fetchWrapper } from "../helpers/Wrapper";
import { UserContext } from "../helpers/UserContext";

const LoginPage = () => {
  const [zId, setZId] = useState("");
  const [zIdValid, setZIdValid] = useState(true);
  const [zPass, setZPass] = useState("");
  const [zPassValid, setZPassValid] = useState(true);

  const { userState, userDispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const loginCall = async (id, pass) => {
    const data = await fetchWrapper("POST", "user/auth/login", null, {
      zId: id,
      zPass: pass
    });
    console.log(id, pass, data);

    // TODO: add error checking
    // TODO: check if user is staff or not
    userDispatch({ type: "login", zId: id, isStaff: false, token: data.token });

    navigate("/checker");
  };

  const onLogin = () => {
    if (!zId) {
      setZIdValid(false);
    }

    if (!zPass) {
      setZPassValid(false);
    }

    if (zId && zPass) {
      loginCall(zId, zPass);
    }
  };

  useEffect(() => {
    console.log(userState);
    if (!userState) {
      userDispatch({ type: "logout" });
    }
  }, []);

  return (
    <div
      css={css`
        text-align: center;
        /* background-color: #f7fafc;
        min-height: 100vh; */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /* font-size: calc(10px + 2vmin);
        color: #646c7d; */
      `}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          width: min(300px, 60vw);
        `}>
        <div
          css={css`
            font-size: calc(35px + 2vmin);
            margin: 20px 0px;
          `}>
          UNSW Progression Checker
        </div>
        <FormControl variant="outlined">
          <InputLabel htmlFor="component-outlined">zID</InputLabel>
          <OutlinedInput
            id="zid-input"
            label="zID"
            value={zId}
            onChange={(e) => {
              setZId(e.target.value);
              setZIdValid(true);
            }}
            error={!zIdValid}
          />
          <FormHelperText
            id="zid-input-helper-text"
            css={css`
              color: #d32f2f;
            `}>
            {!zIdValid ? "Enter your zID" : " "}
          </FormHelperText>
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel htmlFor="component-outlined">zPass</InputLabel>
          <OutlinedInput
            id="zpass-input"
            label="zPass"
            type="password"
            value={zPass}
            onChange={(e) => {
              setZPass(e.target.value);
              setZPassValid(true);
            }}
            error={!zPassValid}
          />
          <FormHelperText
            id="zpass-input-helper-text"
            css={css`
              color: #d32f2f;
            `}>
            {!zPassValid ? "Enter your zPass" : " "}
          </FormHelperText>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          css={css`
            background-color: #4299e1;
          `}
          onClick={onLogin}>
          Log In
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
