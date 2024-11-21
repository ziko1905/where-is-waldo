import { useEffect, useState } from "react";
import { config } from "../Constants";
import "../styles/components/TargetingBox.css";
import TargetPhoto from "./partials/TargetPhoto";

function TargetingBox() {
  const [charactersLeft, setCharactersLeft] = useState([]);

  useEffect(() => {
    fetch(`${config.url.BASE_URL}/search`)
      .then((response) => {
        return response.json();
      })
      .then((chars) => {
        setCharactersLeft(chars);
      })
      .catch((err) => console.log(err));
  }, []);

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
