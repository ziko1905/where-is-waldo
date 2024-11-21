import { useEffect, useState } from "react";
import "./App.css";
import Photo from "./components/Photo";
import TargetingBox from "./components/TargetingBox";
import { config } from "./Constants";

function App() {
  const [selectionToggle, setSelectionToggle] = useState(false);

  function handlePhotoClick() {
    setSelectionToggle((toggle) => !toggle);
  }

  return (
    <>
      <h1>Where&apos;s Waldo?</h1>
      <Photo
        handleClick={handlePhotoClick}
        targetingBox={selectionToggle && <TargetingBox />}
      />
    </>
  );
}

export default App;
