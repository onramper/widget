import { QuoteDetails, TokenInfo } from "layer2";
import { BrakdownItem, WalletItemData } from "../ApiContext/api/types/nextStep";
import initialState from "./initialState";
import { StateType } from "./models";

export enum ActionTypes {
  UpdateWallets = "UPDATE_WALLETS",
  SetSelectedWalletAddress = "SET_SELECTED_WALLET_ADDRESS",
  Init = "INIT",
  SetQuote = "SET_QUOTE",
  UpdateSwapSettings = "UPDATE_SWAP_SETTINGS",
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
        fiatConversion: number;
        feeBreakdown: BrakdownItem[][];
      };
    }
  | {
      type: ActionTypes.SetQuote;
      payload: QuoteDetails;
    }
  | {
      type: ActionTypes.UpdateSwapSettings;
      payload: { slippageTolerance: number; deadline: number };
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

    case ActionTypes.UpdateSwapSettings:
      return {
        ...state,
        slippageTolerance: action.payload.slippageTolerance,
        deadline: action.payload.deadline,
      };
      
    default:
      return state;
  }
};
