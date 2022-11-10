import { createContext } from "react";

// export const StudentContext = createContext({
//   zId: 'z1234567',
//   tempProgramId: '3',
//   tempStreamId: '4'
// });

export const StudentContext = createContext({});

export const studentReducer = (state, action) => {
  switch (action.type) {
    case "setStudent":
      return {
        zId: action.zId,
        tempProgramId: null,
        tempStreamId: null
      };
    case "updateProgram":
      return {
        zId: state.zId,
        tempProgramId: action.tempProgramId,
        tempStreamId: null
      };
    case "updateStream":
      return {
        zId: state.zId,
        tempProgramId: state.tempProgramId,
        tempStreamId: action.tempStreamId
      };
    case "resetStudentModifiers":
      return {
        zId: state.zId,
        tempProgramId: null,
        tempStreamId: null
      };
    case "resetStudent":
      return null;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
