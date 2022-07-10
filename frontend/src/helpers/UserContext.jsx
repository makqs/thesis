import { createContext } from "react";

// export const UserContext = createContext({
//   zId: 'z1234567',
//   token: 'token'
// });

export const UserContext = createContext({});

export const userReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { zId: action.zId, isStaff: action.isStaff, token: action.token };
    case "logout":
      return {};
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
