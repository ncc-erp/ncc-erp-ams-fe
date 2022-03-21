import { GlobalContext } from "context/global/GlobalState";
import { useContext } from "react";

export const useGlobalState = () => {
    const context = useContext(GlobalContext);
    if (!context) {
      throw new Error("useGlobalState must be used within a GlobalStateContext");
    }
    return context;
};
// how to use
// const { data } = useGlobalState();