import waldoImg from "../assets/waldo-1.webp";
import "../styles/components/Photo.css";

function Photo({ handleClick, targetingBox }) {
  return (
    <>
      <div id="img-div">
        <img
          onClick={handleClick}
          src={waldoImg}
          alt="Crowded picture where Waldo and friends are hidden"
        />
        {targetingBox}
      </div>
    </>
  );
}

export default Photo;
