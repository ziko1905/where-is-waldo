import { useEffect, useState } from "react";
import { config } from "../Constants";
import Leaderboard from "./Leaderboard";
import PlayerAddContainer from "./PlayerAddContainer";
import PropTypes from "prop-types";

export default function WonContainer({ isSaved }) {
  const [lb, setLb] = useState([]);

  useEffect(() => {
    handleLbUpdate();
  }, []);

  function handleLbUpdate() {
    fetch(`${config.url.BASE_URL}/leaderboard`)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((response) => {
        console.log("RESPONSE", response);
        setLb(response);
      })
      .catch((err) => {
        console.log(err.msg);
      });
  }

  return (
    <>
      <Leaderboard lb={lb} />
      {!isSaved && <PlayerAddContainer callback={handleLbUpdate} />}
    </>
  );
}

WonContainer.propTypes = {
  isSaved: PropTypes.bool.isRequired,
};
