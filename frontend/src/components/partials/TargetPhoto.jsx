import PropTypes from "prop-types";
import "../../styles/partials/TargetPhoto.css";

function TargetPhoto({ target }) {
  return (
    <img
      className="target-img"
      src={`src/assets/character-${target.toLowerCase()}.webp`}
      alt={`${target} photo`}
    ></img>
  );
}

TargetPhoto.propTypes = {
  target: PropTypes.string.isRequired,
};

export default TargetPhoto;
