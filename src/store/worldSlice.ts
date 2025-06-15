import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface World {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

interface WorldState {
  worlds: World[];
  selectedWorldId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorldState = {
  worlds: [],
  selectedWorldId: null,
  isLoading: false,
  error: null,
};

const worldSlice = createSlice({
  name: "world",
  initialState,
  reducers: {
    addWorld: (state, action: PayloadAction<World>) => {
      state.worlds.push(action.payload);
    },
    removeWorld: (state, action: PayloadAction<number>) => {
      state.worlds = state.worlds.filter(
        (world) => world.id !== action.payload
      );
      if (state.selectedWorldId === action.payload) {
        state.selectedWorldId = null;
      }
    },
    selectWorld: (state, action: PayloadAction<number | null>) => {
      state.selectedWorldId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addWorld, removeWorld, selectWorld, setLoading, setError } =
  worldSlice.actions;
export default worldSlice.reducer;
