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
  UpdateTokenIn = "UpdateTokenIn",
  UpdateTokenOut = "UpdateTokenOut",
  UpdateFiatSymbol = "UpdateFiatSymbol",
}

export type DataActions =
  | {
      type: ActionTypes.UpdateFiatSymbol;
      payload: string;
    }
  | {
      type: ActionTypes.UpdateTokenIn;
      payload: TokenInfo;
    }
  | {
      type: ActionTypes.UpdateTokenOut;
      payload: TokenInfo;
    }
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
        txId: string;
        userId: string;
        tokenIn: TokenInfo;
        tokenOut: TokenInfo;
        fiatSymbol: string;
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
    case ActionTypes.UpdateTokenIn:
      return {
        ...state,
        tokenIn: action.payload,
      };

    case ActionTypes.UpdateTokenOut:
      return {
        ...state,
        tokenOut: action.payload,
      };

    case ActionTypes.UpdateFiatSymbol:
      return {
        ...state,
        fiatSymbol: action.payload,
      };

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
        quote: action.payload,
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
