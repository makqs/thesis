/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useReducer } from "react";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CheckerPage from "./pages/CheckerPage";

import { UserContext, userReducer } from "./helpers/UserContext";

const App = () => {
  const [userState, userDispatch] = useReducer(userReducer, null);
  return (
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={{ userState, userDispatch }}>
        <div
          css={css`
            background-color: #f7fafc;
            min-height: 100vh;
            max-height: 100vh;
            min-width: 100vw;
            max-width: 100vw;
            height: 100%;
            font-size: calc(10px + 2vmin);
            color: #646c7d;
          `}>
          <Router
            css={css`
              height: 100%;
            `}>
            <Routes
              css={css`
                height: 100%;
              `}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/checker" element={<CheckerPage />} />
              <Route path="*" element={<Navigate to="/login" replace redirect />} />
            </Routes>
          </Router>
        </div>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
