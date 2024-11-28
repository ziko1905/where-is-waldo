import PropTypes from "prop-types";
import "../../styles/partials/TargetPhoto.css";
import { useEffect } from "react";
import { useState } from "react";

function TargetPhoto({ target }) {
  const [imgSrc, setImageSrc] = useState();

  useEffect(() => {
    import(`../../assets/character-${target.toLowerCase()}.webp`)
      .then((src) => {
        setImageSrc(src);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <img
      {...(imgSrc ? { src: imgSrc.default } : {})}
      className="target-img"
      alt={`${target} photo`}
    ></img>
  );
}

TargetPhoto.propTypes = {
  target: PropTypes.string.isRequired,
};

export default TargetPhoto;
