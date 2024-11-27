import PropTypes from "prop-types";
import waldoImg from "../assets/waldo-1.webp";
import "../styles/components/Photo.css";

function Photo({ handleClick, targetingBox, marks }) {
  return (
    <>
      <div id="img-div">
        <img
          onClick={handleClick}
          src={waldoImg}
          alt="Crowded picture where Waldo and friends are hidden"
        />
        {targetingBox}
        {marks}
      </div>
    </>
  );
}

Photo.propTypes = {
  handleClick: PropTypes.func.isRequired,
  targetingBox: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  marks: PropTypes.arrayOf(PropTypes.element),
};

export default Photo;
