import React, {
  createContext,
  useContext,
  useReducer,
  ReactChild,
} from "react";
import AppReducer from "./AppReducer";

export interface IGlobalState {
  appEnv: string;
}
export interface IGlobalContext {
  data: IGlobalState;
  test?: (item: any) => void;
}

const initialState: IGlobalContext = {
  data: {} as IGlobalState,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }: { children: ReactChild }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState.data);

  // Actions for changing state

  const test = (item: any) => {
    dispatch({
      type: "TEST",
      payload: item,
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        data: state,
        test,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
