import { useEffect, useState } from "react";
import { config } from "../Constants";

function TargetingBox() {
  const [charactersLeft, setCharactersLeft] = useState([]);

  useEffect(() => {
    fetch(`${config.url.BASE_URL}/finds`)
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
      <div aria-label="Selection box for characters found">
        {charactersLeft.map((char) => (
          <div key={char.id} data-testid={"character-left"}>
            <span key={char.id} aria-label="Character name">
              {char.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default TargetingBox;
