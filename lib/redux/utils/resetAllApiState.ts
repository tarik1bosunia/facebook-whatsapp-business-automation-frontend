import { apiSlice } from "../api/apiSlice";
import { AppDispatch } from "../store";

export const resetAllApiState = () => (dispatch: AppDispatch) => {
  dispatch(apiSlice.util.resetApiState());
};