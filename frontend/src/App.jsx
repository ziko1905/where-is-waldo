import { useEffect, useRef, useState } from "react";
import "./App.css";
import Photo from "./components/Photo";
import markerSrc from "./assets/cross-mark.svg";
import TargetingBox from "./components/TargetingBox";
import { config } from "./Constants";
import WonContainer from "./components/WonContainer";

const MARKER_STYLE = {
  position: "fixed",
  width: "4vw",
  transform: "translate(-50%, -50%)",
};

const useIsSaved = () => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetch(`${config.url.BASE_URL}/leaderboard/saved`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status}:${response.statusText}`);
        } else {
          return response.json();
        }
      })
      .then((response) => {
        if (response.isSaved) setIsSaved(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return [isSaved, setIsSaved];
};

const useHasWon = (setTime) => {
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    fetch(`${config.url.BASE_URL}/leaderboard/won`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status}:${response.statusText}`);
        } else {
          return response.json();
        }
      })
      .then((response) => {
        if (response.hasWon) {
          setHasWon(response.hasWon);
          setTime(response.time);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return [hasWon, setHasWon];
};

function App() {
  const [selectionToggle, setSelectionToggle] = useState(false);
  const [time, setTime] = useState();
  const [hasWon, setHasWon] = useHasWon(setTime);
  const [isSaved, setIsSaved] = useIsSaved();
  const sendData = useRef({});
  const markerData = useRef({});
  const [markers, setMarkers] = useState([]);

  console.log("TIME HERE", time);

  function handlePhotoClick(event) {
    if (hasWon) return;
    handleTBToggle();
    const positions = event.target.getBoundingClientRect();
    sendData.current = {
      photoWidth: positions.width,
      photoHeight: positions.height,
      positionX: event.clientX - positions.x,
      positionY: event.clientY - positions.y,
    };
    markerData.current = {
      positionL: event.clientX,
      positionT: event.clientY,
    };
  }

  function handleSearchAttempt(selected) {
    if (!selected) {
      setHasWon(true);
      return;
    }

    sendData.current.selected = selected;
    fetch(`${config.url.BASE_URL}/search`, {
      mode: "cors",
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...sendData.current }),
    })
      .then(async (res) => {
        if (res.status == 400) {
          throw new Error(
            `${res.text() ? res.text() : res.statusText}: ${res.status}`
          );
        } else if (res.status == 201 || res.status == 202) {
          handleMarkerSet(markerData.current);
        }

        if (res.status == 202) {
          setHasWon(true);
          return res.json();
        }
      })
      .then((response) => {
        setTime(response.time);
      })
      .catch((err) => {
        console.log(`${err.msg}`);
      });
  }

  function handleTBToggle() {
    setSelectionToggle(!selectionToggle);
  }

  function handleMarkerSet({ positionL, positionT }) {
    const currMarkers = [...markers];
    const currMarkerStyle = {
      ...MARKER_STYLE,
      top: `${positionT}px`,
      left: `${positionL}px`,
    };
    currMarkers.push(
      <img
        src={markerSrc}
        alt="Cross Mark"
        style={{ ...currMarkerStyle }}
        key={crypto.randomUUID()}
      ></img>
    );
    setMarkers(currMarkers);
  }

  return (
    <>
      <h1>Where&apos;s Waldo?</h1>
      <Photo
        handleClick={handlePhotoClick}
        targetingBox={
          selectionToggle && (
            <TargetingBox
              handleToggle={handleTBToggle}
              handleSearchAttempt={handleSearchAttempt}
            />
          )
        }
        marks={markers}
      />
      {hasWon && (
        <WonContainer
          isSaved={isSaved}
          setIsSaved={setIsSaved}
          sessionTime={time}
        />
      )}
    </>
  );
}

export default App;
