import * as types from "../action-types";

export const setDeptList = (list) => {
    return {
      type: types.USER_SET_USER_TOKEN,
      list,
    };
  };
