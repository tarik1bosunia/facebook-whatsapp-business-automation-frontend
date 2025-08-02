import { conversationApi } from "../services/conversationApi";
import { authApi } from "../api/authApi";
import { businessApi } from "../services/businessApi";
import { aimodelApi } from "../features/ai/aiModelApi";
import { productsApi } from "../features/productsApi";
import { userApi } from "../features/user/userApi";
import { userApi as userSuperAdminApi } from "../features/superadmin/userApi";
import { activityApi } from "../features/activityApi";

export const resetAllApiState = () => (dispatch: any) => {
  dispatch(conversationApi.util.resetApiState());
  dispatch(authApi.util.resetApiState());
  dispatch(businessApi.util.resetApiState());
  dispatch(aimodelApi.util.resetApiState());
  dispatch(productsApi.util.resetApiState());
  dispatch(userApi.util.resetApiState());
  dispatch(userSuperAdminApi.util.resetApiState());
  dispatch(activityApi.util.resetApiState());
};