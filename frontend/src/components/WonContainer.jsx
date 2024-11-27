import { useEffect, useState } from "react";
import { config } from "../Constants";
import Leaderboard from "./Leaderboard";
import PlayerAddContainer from "./PlayerAddContainer";
import PropTypes from "prop-types";

export default function WonContainer({ isSaved, setIsSaved, sessionTime }) {
  const [lb, setLb] = useState([]);

  useEffect(() => {
    handleLbUpdate();
  }, [isSaved]);

  function handleLbUpdate() {
    fetch(`${config.url.BASE_URL}/leaderboard`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((response) => {
        setLb(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Leaderboard lb={lb} sessionTime={sessionTime} />
      {!isSaved && (
        <PlayerAddContainer callback={handleLbUpdate} setIsSaved={setIsSaved} />
      )}
    </>
  );
}

WonContainer.propTypes = {
  isSaved: PropTypes.bool.isRequired,
  setIsSaved: PropTypes.func.isRequired,
  sessionTime: PropTypes.number.isRequired,
};
