import { auth } from "firebase/client";
import React, {useState} from "react";
import {useRouter} from 'next/router'
import Image from 'next/image'

//styles
import styles from "styles/Avatar.module.scss";

//icons
import DoorIcon from "components/icons/DoorIcon";
import UserIcon from "components/icons/UserIcon";

function Avatar({ username, avatar, email }) {

  const router = useRouter()
  const[active, setActive] = useState(false)

  const toggleMenu = () => {
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
    <div className={styles.avatarContainer}>
      <div onClick={toggleMenu} className={`${styles.avatar} avatar`}>
          <Image
            src={avatar}
            layout="fill"
            objectFit="cover"
          />
      </div>
      <ul className="menu">
        <h3 className={styles.subtitle}> Hola, {username}</h3>
        <span>{email}</span>
        <li onClick={goAccount} className={styles.roundedButtonTerciary}>Mi cuenta <UserIcon/> </li>
        <li onClick={logout} className={styles.roundedButtonTerciary}>Cerrar sesión <DoorIcon/> </li>
      </ul>

      <style jsx>
        {`
          .avatar {
            //border: ${active ? "3px solid rgba(6, 123, 194,.15)" : "3px solid transparent"};
          }

          button {
            font-size: 8px !important;
          }

          .menu {
            display: ${active ? "flex" : "none"};
          }
        `}
      </style>
    </div>
  );
}

export default Avatar;
