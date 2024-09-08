import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./store";
import { RootState } from "./store"; // Import the RootState type

const Counter = () => {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter); // Use RootState for typing

  useEffect(() => {
    console.log("Client-side component mounted");
  }, []);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => console.log("Hello World!")}>test</button>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <Counter />
    </div>
  );
};

export default App;
