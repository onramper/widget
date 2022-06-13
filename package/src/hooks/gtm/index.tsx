import React, {
  ReactNode,
  createContext,
  useEffect,
  useContext,
  useReducer,
} from "react";
import { IGtmParams, initGTM, sendToGTM } from "./GoogleTagManager";
import * as constants from "../../ApiContext/api/constants";

export type GTMProviderProps = {
  state?: IGtmParams;
  children: ReactNode;
};

const initialState: IGtmParams = {
  gtmId: "",
  dataLayer: undefined,
  dataLayerName: constants.DEFAULT_GTM_DATA_LAYER,
};

export const GTMContext = createContext<IGtmParams | undefined>(initialState);
export const GTMContextDispatch = createContext<any | undefined>(undefined);

function dataReducer(state: IGtmParams, data: any) {
  sendToGTM({ dataLayerName: state?.dataLayer?.dataLayerName!, data });
  return state;
}

const GTMProvider: React.FC<GTMProviderProps> = ({ state, children }) => {
  const [store, dispatch] = useReducer(dataReducer, {
    ...initialState,
    ...state,
  });

  const mergedState = { ...store, ...state };
  useEffect(() => {
    initGTM({
      gtmId: mergedState.gtmId,
      dataLayer: mergedState.dataLayer,
      dataLayerName: mergedState.dataLayerName,
    });
  }, [state]);

  return (
    <GTMContext.Provider value={store}>
      <GTMContextDispatch.Provider value={dispatch}>
        {children}
      </GTMContextDispatch.Provider>
    </GTMContext.Provider>
  );
};

function useGTMDispatch() {
  const context = useContext(GTMContextDispatch);
  if (context === undefined) {
    throw new Error("dispatchGTMEvent must be used within a GTMProvider");
  }

  return context;
}

export { GTMProvider, useGTMDispatch, sendToGTM };
