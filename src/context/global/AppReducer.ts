import React from "react";

const appReducer = (state: any, action: any) => {
  switch (action.type) {
    case "TEST":
      return {
        appEnv: "test",
      };
    default:
      return state;
  }
};
export default appReducer;
