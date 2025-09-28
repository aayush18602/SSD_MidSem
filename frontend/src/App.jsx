import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Doubts from "./components/Doubts";
import "./App.css";

function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Doubts />
      </Provider>
    </React.StrictMode>
  );
}

export default App;
