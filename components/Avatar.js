import { auth } from "firebase/client";
import React, {useState} from "react";
import {useRouter} from 'next/router'

//styles
import styles from "styles/Avatar.module.scss";

//icons
import DoorIcon from "components/icons/DoorIcon";
import UserIcon from "components/icons/UserIcon";

function Avatar({ username, avatar, email }) {

  const router = useRouter()
  const[active, setActive] = useState(false)

  const toggleMenu = () => {
    menu.classList.toggle("visible");
    setActive(!active)
  };

  const goAccount = () => {
    router.push('/myaccount')
    setActive(!active)
    menu.classList.toggle("visible")
  }

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
        <li onClick={goAccount} className={styles.roundedButtonTerciary}>Mi cuenta <UserIcon/> </li>
        <li onClick={logout} className={styles.roundedButtonTerciary}>Cerrar sesión <DoorIcon/> </li>
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
            width: 35px;
            
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
