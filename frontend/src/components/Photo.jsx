import waldoImg from "../assets/waldo-1.webp";

function Photo({ handleClick }) {
  return (
    <>
      <img
        onClick={handleClick}
        src={waldoImg}
        alt="Crowded picture where Waldo and friends are hidden"
      />
    </>
  );
}

export default Photo;
