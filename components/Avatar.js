import { auth } from "firebase/client";
import React from "react";
import styles from "styles/Avatar.module.scss";

function Avatar({ username, avatar, short }) {
  const toggleMenu = () => {
    const menu = document.getElementById("menu");
    menu.classList.toggle("visible");
  };

  const logout = () => {
    auth.signOut();
  };

  return (
    <div className={styles.avatar}>
      <div onClick={toggleMenu}>
        {!short && <span>{username}</span>}
        <img src={avatar} alt={username} />
      </div>
      <ul id="menu">
        <li>My profile</li>
        <li onClick={logout}>Logout</li>
      </ul>

      <style jsx>
        {`
          div {
            position: relative;
            display: flex;
            align-items: center;
          }

          h2 {
            padding: 10px;
          }

          img {
            width: 50px;
            clip-path: circle(25px);
          }

          button {
            font-size: 8px !important;
          }

          .visible {
            display: flex;
          }
        `}
      </style>
    </div>
  );
}

export default Avatar;
