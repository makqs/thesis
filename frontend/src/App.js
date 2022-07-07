/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CheckerPage from "./pages/CheckerPage";

const App = () => {
  return (
    <div
      css={css`
        background-color: #f7fafc;
        min-height: 100vh;
        height: 100%;
        font-size: calc(10px + 2vmin);
        color: #646c7d;
      `}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checker" element={<CheckerPage />} />
          <Route path="*" element={<Navigate to="/login" replace redirect />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
