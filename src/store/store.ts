import { configureStore } from "@reduxjs/toolkit";
import worldReducer from "./worldSlice";

export const store = configureStore({
  reducer: {
    world: worldReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
