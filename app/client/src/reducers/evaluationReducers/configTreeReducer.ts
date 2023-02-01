import {
  ReduxAction,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import { createImmerReducer } from "utils/ReducerUtils";
import { ConfigTree } from "entities/DataTree/dataTreeFactory";

export type ConfigTreeState = any;

const initialState: ConfigTreeState = {};

const configTreeReducer = createImmerReducer(initialState, {
  [ReduxActionTypes.SET_CONFIG_TREE]: (
    state: ConfigTreeState,
    action: ReduxAction<{
      configTree: ConfigTree;
    }>,
  ) => action.payload.configTree,
  [ReduxActionTypes.FETCH_PAGE_INIT]: () => initialState,
});

export default configTreeReducer;