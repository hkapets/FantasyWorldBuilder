import { configureStore } from "@reduxjs/toolkit";
import worldSlice from "./worldSlice";

export const store = configureStore({
  reducer: {
    worldSlice: worldSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
