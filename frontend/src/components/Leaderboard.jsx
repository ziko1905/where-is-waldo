import PropTypes from "prop-types";
import PlayerCard from "./partials/PlayerCard";

export default function Leaderboard({ lb = [] }) {
  console.log(lb);

  return (
    <>
      <div className="lb"></div>
      {!!lb.length &&
        lb.map((ply, index) => {
          const position = index + 1;
          return (
            <PlayerCard key={crypto.randomUUID()} {...ply} pos={position} />
          );
        })}
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
};
