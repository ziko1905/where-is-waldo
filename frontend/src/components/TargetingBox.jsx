import { useEffect, useState } from "react";
import { config } from "../Constants";
import "../styles/components/TargetingBox.css";
import TargetPhoto from "./partials/TargetPhoto";

function TargetingBox({ handleSearchAttempt, handleToggle }) {
  const [charactersLeft, setCharactersLeft] = useState([]);

  useEffect(() => {
    fetch(`${config.url.BASE_URL}/search`, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((chars) => {
        setCharactersLeft(chars);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleSelect(name) {
    handleSearchAttempt(name);
    handleToggle();
  }

  return (
    <>
      <div
        className="targeting-box"
        aria-label="Selection box for characters found"
      >
        {charactersLeft.map((char) => (
          <div
            className="char-target-box"
            key={`${char.name}-div`}
            data-testid={"character-left"}
            onClick={() => handleSelect(char.name)}
          >
            <TargetPhoto target={char.name} />
            <span
              className="char-name"
              key={`${char.name}-span`}
              aria-label="Character name"
            >
              {char.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default TargetingBox;
