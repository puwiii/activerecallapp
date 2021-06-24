import { auth } from "firebase/client";
import React, {useState} from "react";
import styles from "styles/Avatar.module.scss";

//icons
import DoorIcon from "./icons/DoorIcon";
import UserIcon from "./icons/UserIcon";

function Avatar({ username, avatar, email }) {

  const[active, setActive] = useState(false)

  const toggleMenu = () => {
    const menu = document.getElementById("menu");
    menu.classList.toggle("visible");
    setActive(!active)
  };

  const logout = () => {
    auth.signOut();
  };

  return (
    <div className={styles.avatar}>
      <div onClick={toggleMenu} className={`img-container ${(active && 'active')}` }>
        <img src={avatar} alt={username} />
      </div>
      <ul id="menu">
        <h3 className={styles.subtitle}> Hola, {username}</h3>
        <span>{email}</span>
        <hr/>
        <li className={styles.roundedButtonTerciary}>Mi cuenta <UserIcon/> </li>
        <hr/>
        <li onClick={logout} className={styles.roundedButtonTerciary}>Cerrar sesión <DoorIcon/> </li>
        <hr/>
      </ul>

      <style jsx>
        {`
          .img-container {
            position: relative;
            display: flex;
            align-items: center;
            border-radius: 100%;
            border: 3px solid transparent;
            background-color: rgba(0,0,0,.05);
            transition: border .3s ease-in-out;
          }
          
          .active{
            border: 3px solid rgba(6, 123, 194,.15);
          }

          img {
            width: 40px;
            
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
