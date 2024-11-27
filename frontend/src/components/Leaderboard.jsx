import PropTypes from "prop-types";
import PlayerCard from "./partials/PlayerCard";
import convertMSToStr from "../utils/convertMSToStr";

export default function Leaderboard({ lb = [], sessionTime }) {
  return (
    <>
      <div className="lb">
        <span>Your Time: {convertMSToStr(sessionTime)}</span>
        {!!lb.length &&
          lb.map((ply, index) => {
            const position = index + 1;
            return (
              <PlayerCard key={crypto.randomUUID()} {...ply} pos={position} />
            );
          })}
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
