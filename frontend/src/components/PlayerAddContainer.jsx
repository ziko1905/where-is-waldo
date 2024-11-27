import PropTypes from "prop-types";
import { useState } from "react";
import { config } from "../Constants";

export default function PlayerAddContainer({ setIsSaved }) {
  const [name, setName] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    fetch(`${config.url.BASE_URL}/leaderboard`, {
      credentials: "include",
      method: "post",
      body: JSON.stringify({ name: name }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.statusText}: ${response.status}`);
        }
        return response.json();
      })
      .then();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
