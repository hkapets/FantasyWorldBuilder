import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Location {
  id: string;
  name: string;
  description: string;
  type: "city" | "forest" | "mountain" | "dungeon" | "misc";
}

export interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
}

export interface World {
  id: string;
  name: string;
  description: string;
  locations: Location[];
  characters: Character[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface WorldState {
  worlds: World[];
  currentWorld: World | null;
}

const initialState: WorldState = {
  worlds: [],
  currentWorld: null,
};

const worldSlice = createSlice({
  name: "world",
  initialState,
  reducers: {
    createWorld: (state, action: PayloadAction<World>) => {
      state.worlds.push(action.payload);
    },

    updateWorld: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<World> }>
    ) => {
      const { id, updates } = action.payload;
      const worldIndex = state.worlds.findIndex((world) => world.id === id);
      if (worldIndex !== -1) {
        state.worlds[worldIndex] = {
          ...state.worlds[worldIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteWorld: (state, action: PayloadAction<string>) => {
      state.worlds = state.worlds.filter(
        (world) => world.id !== action.payload
      );
    },

    setCurrentWorld: (state, action: PayloadAction<World | null>) => {
      state.currentWorld = action.payload;
    },

    addLocation: (
      state,
      action: PayloadAction<{ worldId: string; location: Location }>
    ) => {
      const { worldId, location } = action.payload;
      const world = state.worlds.find((w) => w.id === worldId);
      if (world) {
        world.locations.push(location);
        world.updatedAt = new Date().toISOString();
      }
    },

    updateLocation: (
      state,
      action: PayloadAction<{
        worldId: string;
        locationId: string;
        updates: Partial<Location>;
      }>
    ) => {
      const { worldId, locationId, updates } = action.payload;
      const world = state.worlds.find((w) => w.id === worldId);
      if (world) {
        const locationIndex = world.locations.findIndex(
          (l) => l.id === locationId
        );
        if (locationIndex !== -1) {
          world.locations[locationIndex] = {
            ...world.locations[locationIndex],
            ...updates,
          };
          world.updatedAt = new Date().toISOString();
        }
      }
    },

    removeLocation: (
      state,
      action: PayloadAction<{ worldId: string; locationId: string }>
    ) => {
      const { worldId, locationId } = action.payload;
      const world = state.worlds.find((w) => w.id === worldId);
      if (world) {
        world.locations = world.locations.filter((l) => l.id !== locationId);
        world.updatedAt = new Date().toISOString();
      }
    },

    addCharacter: (
      state,
      action: PayloadAction<{ worldId: string; character: Character }>
    ) => {
      const { worldId, character } = action.payload;
      const world = state.worlds.find((w) => w.id === worldId);
      if (world) {
        world.characters.push(character);
        world.updatedAt = new Date().toISOString();
      }
    },

    updateCharacter: (
      state,
      action: PayloadAction<{
        worldId: string;
        characterId: string;
        updates: Partial<Character>;
      }>
    ) => {
      const { worldId, characterId, updates } = action.payload;
      const world = state.worlds.find((w) => w.id === worldId);
      if (world) {
        const characterIndex = world.characters.findIndex(
          (c) => c.id === characterId
        );
        if (characterIndex !== -1) {
          world.characters[characterIndex] = {
            ...world.characters[characterIndex],
            ...updates,
          };
          world.updatedAt = new Date().toISOString();
        }
      }
    },

    removeCharacter: (
      state,
      action: PayloadAction<{ worldId: string; characterId: string }>
    ) => {
      const { worldId, characterId } = action.payload;
      const world = state.worlds.find((w) => w.id === worldId);
      if (world) {
        world.characters = world.characters.filter((c) => c.id !== characterId);
        world.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  createWorld,
  updateWorld,
  deleteWorld,
  setCurrentWorld,
  addLocation,
  updateLocation,
  removeLocation,
  addCharacter,
  updateCharacter,
  removeCharacter,
} = worldSlice.actions;

export default worldSlice.reducer;
