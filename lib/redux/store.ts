import { configureStore } from '@reduxjs/toolkit'
import { conversationApi } from "./services/conversationApi";
import { apiSlice } from './api/apiSlice';
import chatReducer from './slices/chatSlice';
import { authApi } from './api/authApi';
import authReducer from './slices/authSlice';
import { businessApi } from './services/businessApi';
import { aimodelApi } from './features/ai/aiModelApi';
import { productsApi } from './features/productsApi';


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: conversationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [businessApi.reducerPath]: businessApi.reducer,
    [aimodelApi.reducerPath]: aimodelApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
     chat: chatReducer, 
     auth: authReducer
  },
// Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      authApi.middleware,
      businessApi.middleware,
      aimodelApi.middleware,
      productsApi.middleware,
    ),
  // Optional: configure dev tools in development
  devTools: process.env.NODE_ENV !== "production",
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch