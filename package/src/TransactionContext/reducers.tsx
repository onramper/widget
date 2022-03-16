import { WalletItemData } from "../ApiContext/api/types/nextStep";
import { StateType } from "./models";

export enum ActionTypes {
  UpdateWallets = "UPDATE_WALLETS",
  SetSelectedWalletAddress = "SET_SELECTED_WALLET_ADDRESS",
  Init = "Init",
}

export type DataActions =
  | {
      type: ActionTypes.UpdateWallets;
      payload: WalletItemData[];
    }
  | {
      type: ActionTypes.SetSelectedWalletAddress;
      payload: string;
    }
  | {
      type: ActionTypes.Init;
      payload: {
        userId: string;
      };
    };

export default (state: StateType, action: DataActions) => {
  switch (action.type) {
    case ActionTypes.UpdateWallets:
      return {
        ...state,
        wallets: action.payload,
      } as StateType;

    case ActionTypes.SetSelectedWalletAddress:
      return {
        ...state,
        selectedWalletAddress: action.payload,
      } as StateType;

    case ActionTypes.Init:
      return {
        ...state,
        ...action.payload,
      } as StateType;
      
    default:
      return state;
  }
};
