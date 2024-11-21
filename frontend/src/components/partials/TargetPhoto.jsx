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

export default TargetPhoto;
