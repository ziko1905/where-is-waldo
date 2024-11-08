import { useState } from "react";
import "./App.css";
import Photo from "./components/Photo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Where's Waldo?</h1>
      <Photo />
    </>
  );
}

export default App;
