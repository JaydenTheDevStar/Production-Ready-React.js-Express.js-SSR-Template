import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { store as initialStore, rootReducer } from "./store";

// Get the preloaded state from the server-side rendering
const preloadedState = (window as any).__PRELOADED_STATE__;
delete (window as any).__PRELOADED_STATE__; // Clean up the global object

// If there is preloaded state, initialize the Redux store with it
const store = preloadedState
  ? configureStore({
      reducer: rootReducer.counter,
      preloadedState,
    })
  : initialStore;

ReactDOM.hydrate(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
