/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useReducer } from "react";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import LoginPage from "./pages/LoginPage";
import CheckerPage from "./pages/CheckerPage";

import { UserContext, userReducer } from "./helpers/UserContext";
import { StudentContext, studentReducer } from "./helpers/StudentContext";

const App = () => {
  const [userState, userDispatch] = useReducer(userReducer, null);
  const [studentState, studentDispatch] = useReducer(studentReducer, null);
  return (
    <SnackbarProvider maxSnack={3}>
      <QueryClientProvider client={new QueryClient()}>
        <UserContext.Provider value={{ userState, userDispatch }}>
          <StudentContext.Provider value={{ studentState, studentDispatch }}>
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
          </StudentContext.Provider>
        </UserContext.Provider>
      </QueryClientProvider>
    </SnackbarProvider>
  );
};

export default App;
