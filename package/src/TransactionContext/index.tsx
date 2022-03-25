import React, { createContext, useReducer } from "react";
import initialState from "./initialState";
import mainReducer, { DataActions } from "./reducers";
import { StateType } from "./models";

const TransactionContext = createContext<{
  dispatch: React.Dispatch<DataActions>;
  state: StateType;
}>({
  state: initialState,
  dispatch: () => {},
});

const TransactionContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TransactionContext.Provider>
  );
};

export { TransactionContextProvider, TransactionContext };
