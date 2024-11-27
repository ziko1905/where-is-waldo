import PropTypes from "prop-types";
import convertMSToStr from "../../utils/convertMSToStr";

export default function PlayerCard({ name, timeMS, pos }) {
  return (
    <div>
      <span aria-label="Players Position">{pos}.</span>
      <span aria-label="Players Name">{name}</span>
      <span aria-label="Players Time">{convertMSToStr(timeMS)}</span>
    </div>
  );
}

PlayerCard.propTypes = {
  name: PropTypes.string.isRequired,
  timeMS: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
};
