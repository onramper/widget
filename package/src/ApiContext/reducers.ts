import {
  StateType,
  DataStateType,
  ErrorObjectType,
  StaticRoutingItemType,
} from "./initialState";
import { CollectedStateType, ItemType } from ".";

export enum CollectedActionsType {
  AddField = "ADD_FIELD",
  AddFile = "ADD_FILE",
  DeleteFile = "DELETE_FILE",
  AddError = "ADD_ERROR",
  ResetCollected = "RESET_COLLECTED",
  UpdateStaticRoute = "UPDATE_STATIC_ROUTING",
}

export enum DataActionsType {
  AddData = "ADD_DATA",
  // TODO: it seems that the following 2 are no longer used: investigate and proceed to delete them
  Init = "INIT",
  AddCollected = "ADD_COLLECTED",
}

export type DataActions =
  | {
      type: CollectedActionsType.AddField;
      payload: {
        name: string;
        value: number | string | boolean | ItemType | any;
      };
    }
  | {
      type: CollectedActionsType.AddFile;
      payload: {
        name: string;
        value: File[];
      };
    }
  | {
      type: CollectedActionsType.DeleteFile;
      payload: {
        name: string;
        value: string;
      };
    }
  | {
      type: DataActionsType.AddData;
      payload: {
        value: DataStateType;
      };
    }
  | {
      type: CollectedActionsType.AddError;
      payload: {
        value: ErrorObjectType | undefined;
      };
    }
  | {
      type: CollectedActionsType.ResetCollected;
      payload: {
        value: CollectedStateType;
      };
    }
  | {
      type: CollectedActionsType.UpdateStaticRoute;
      payload: {
        value: StaticRoutingItemType[];
      };
    };

export const mainReducer = (state: StateType, action: DataActions) => ({
  ...state,
  collected: collectedReducer(state, action),
  data: dataReducer(state, action),
});

export const collectedReducer = (state: StateType, action: DataActions) => {
  switch (action.type) {
    case CollectedActionsType.AddField: {
      return {
        ...state.collected,
        [action.payload.name]: action.payload.value,
      };
    }
    case CollectedActionsType.AddFile: {
      let newFiles = action.payload.value;
      if (newFiles && newFiles.length > 0) {
        const existingFiles = (
          state.collected[action.payload.name] as File[]
        ).map((f) => f.name);
        newFiles = newFiles.filter((f) => !existingFiles.includes(f.name));
      }
      return {
        ...state.collected,
        [action.payload.name]: [
          ...state.collected[action.payload.name],
          ...newFiles,
        ],
      };
    }
    case CollectedActionsType.DeleteFile: {
      const name2delete = action.payload.value;
      const newList = (state.collected[action.payload.name] as File[]).filter(
        (f) => f.name !== name2delete
      );
      return {
        ...state.collected,
        [action.payload.name]: [...newList],
      };
    }
    case CollectedActionsType.AddError: {
      const error = action.payload.value;
      if (!error)
        return {
          ...state.collected,
          errors: undefined,
        };
      else if (Object.entries(error).length > 0)
        return {
          ...state.collected,
          errors: { ...state.collected.errors, ...error },
        };
      else return state.collected;
    }
    case CollectedActionsType.UpdateStaticRoute: {
      return {
        ...state.collected,
        staticRouting: action.payload.value,
      };
    }
    case CollectedActionsType.ResetCollected: {
      return action.payload.value;
    }
    default:
      return state.collected;
  }
};

export const dataReducer = (state: StateType, action: DataActions) => {
  switch (action.type) {
    case DataActionsType.AddData:
      return {
        ...state.data,
        ...action.payload.value,
      };
    default:
      return state.data;
  }
};
