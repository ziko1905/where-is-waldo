import PropTypes from "prop-types";
import convertMSToStr from "../../utils/convertMSToStr";
import "../../styles/partials/PlayerCard.css";

export default function PlayerCard({ name, timeMS, pos }) {
  return (
    <div className="result-card">
      <span className="result-position" aria-label="Players Position">
        {pos}.
      </span>
      <span className="result-name" aria-label="Players Name">
        {name}
      </span>
      <span className="result-time" aria-label="Players Time">
        {convertMSToStr(timeMS)}
      </span>
    </div>
  );
}

PlayerCard.propTypes = {
  name: PropTypes.string.isRequired,
  timeMS: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
};
