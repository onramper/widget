import { QuoteDetails, TokenInfo } from "layer2";
import { WalletItemData } from "../ApiContext/api/types/nextStep";
import initialState from "./initialState";
import { StateType } from "./models";

export enum ActionTypes {
  UpdateWallets = "UpdateWallets",
  SetSelectedWalletAddress = "SetSelectedWalletAddress",
  Init = "Init",
  SetQuote = "SetQuote",
  UpdateDeadline = "UpdateDeadline",
  UpdateSlippageTolerance = "UpdateSlippageTolerance",
}

export type DataActions =
  | {
      type: ActionTypes.UpdateWallets;
      payload: WalletItemData[];
    }
  | {
      type: ActionTypes.SetSelectedWalletAddress;
      payload?: string;
    }
  | {
      type: ActionTypes.Init;
      payload: {
        key: number;
        userId: string;
        tokenIn: TokenInfo;
        tokenOut: TokenInfo;
        currentQuote: QuoteDetails;
        fiatSymbol: string;
        fiatConversionIn: number;
        fiatConversionOut: number;
      };
    }
  | {
      type: ActionTypes.SetQuote;
      payload: QuoteDetails;
    }
  | {
      type: ActionTypes.UpdateDeadline | ActionTypes.UpdateSlippageTolerance;
      payload: number;
    };

export default (state: StateType, action: DataActions): StateType => {
  switch (action.type) {
    case ActionTypes.Init:
      return {
        ...initialState,
        ...action.payload,
      };

    case ActionTypes.UpdateWallets:
      return {
        ...state,
        wallets: action.payload,
      };

    case ActionTypes.SetSelectedWalletAddress:
      return {
        ...state,
        selectedWalletAddress: action.payload,
      };

    case ActionTypes.SetQuote:
      return {
        ...state,
        currentQuote: action.payload,
      };

    case ActionTypes.UpdateDeadline:
      return {
        ...state,
        deadline: action.payload,
      };

    case ActionTypes.UpdateSlippageTolerance:
      return {
        ...state,
        slippageTolerance: action.payload,
      };

    default:
      return state;
  }
};
