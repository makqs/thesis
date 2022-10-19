import { createContext } from "react";

// export const StudentContext = createContext({
//   zId: 'z1234567'
// });

export const StudentContext = createContext({});

export const studentReducer = (state, action) => {
  switch (action.type) {
    case "setStudent":
      return {
        zId: action.zId
      };
    case "resetStudent":
      return {};
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
