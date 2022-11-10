import { createContext } from "react";

// export const UserContext = createContext({
//   zId: 'z1234567',
//   token: 'token'
// });

export const UserContext = createContext({});

export const userReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        zId: action.zId,
        name: action.name,
        isStaff: action.isStaff,
        token: action.token
      };
    case "logout":
      return null;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
