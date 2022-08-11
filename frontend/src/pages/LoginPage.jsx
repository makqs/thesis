/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useContext, useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../helpers/UserContext";

const LoginPage = () => {
  const [zId, setZId] = useState("z5555555");
  const [zIdValid, setZIdValid] = useState(true);
  const [zPass, setZPass] = useState("asdf");
  const [zPassValid, setZPassValid] = useState(true);

  const { userState, userDispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const loginMutation = useMutation((zid, zpass) => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        zid,
        zpass
      })
    };
    return fetch("http://127.0.0.1:5000/user/auth/login", requestOptions).then((res) => res.json());
  });

  const loginCall = async (zid, zpass) => {
    const data = await loginMutation.mutateAsync(zid, zpass);

    if ("error" in data) {
      return;
    }

    // TODO: check if user is staff or not
    userDispatch({
      type: "login",
      zId: data.zid,
      name: data.name,
      isStaff: data.is_staff,
      token: data.token
    });

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
