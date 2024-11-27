import PropTypes from "prop-types";
import PlayerCard from "./partials/PlayerCard";
import convertMSToStr from "../utils/convertMSToStr";
import "../styles/components/Leaderboard.css";

export default function Leaderboard({ lb = [], sessionTime }) {
  return (
    <>
      <div className="lb">
        <span id="player-time">Your Time: {convertMSToStr(sessionTime)}</span>
        <div className="results">
          {!!lb.length &&
            lb.map((ply, index) => {
              const position = index + 1;
              return (
                <PlayerCard key={crypto.randomUUID()} {...ply} pos={position} />
              );
            })}
        </div>
        <span id={"greeting-span"}>Thank you for playing!</span>
      </div>
    </>
  );
}

Leaderboard.propTypes = {
  lb: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      timeMS: PropTypes.number.isRequired,
    }).isRequired
  ),
  sessionTime: PropTypes.number.isRequired,
};
