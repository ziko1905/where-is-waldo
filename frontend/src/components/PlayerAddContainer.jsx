import PropTypes from "prop-types";
import { useState } from "react";
import { config } from "../Constants";
import "../styles/components/PlayerAddContainer.css";

export default function PlayerAddContainer({ setIsSaved }) {
  const [name, setName] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    fetch(`${config.url.BASE_URL}/leaderboard`, {
      mode: "cors",
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.statusText}: ${response.status}`);
        }
        setIsSaved(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div id="player-add-container">
      <span>Add your time to the leaderboard</span>
      <form id="player-add-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Username: </label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          name="name"
          id="name"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

PlayerAddContainer.propTypes = {
  setIsSaved: PropTypes.func.isRequired,
};
