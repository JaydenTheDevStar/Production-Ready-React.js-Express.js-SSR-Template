import { configureStore, createSlice } from "@reduxjs/toolkit";

// Create a simple slice (reducer)
const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});

export const { increment, decrement } = counterSlice.actions;

// Export the reducer separately for reuse
export const rootReducer = {
  counter: counterSlice.reducer,
};

// Configure the store
export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
