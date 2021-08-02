import { auth } from "firebase/client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

//styles
import styles from "styles/Avatar.module.scss";

//icons
import DoorIcon from "icons/DoorIcon";
import UserIcon from "icons/UserIcon";
import DownArrowIcon from "icons/DownArrowIcon";

//components
import SpinnerComponentCircle from "./SpinnerComponentCircle";

function Avatar({ username, avatar, email }) {
  const router = useRouter();
  const [active, setActive] = useState(false);

  const goAccount = () => {
    router.push("/myaccount");
    setActive(false);
  };

  const logout = () => {
    auth.signOut();
  };

  return (
    <div className={styles.avatarContainer}>
      <div onClick={(e) => setActive(!active)} className={styles.avatar}>
        <div className={styles.avatar__image}>
          <Image
            src={avatar}
            layout="fill"
            objectFit="cover"
            alt={username}
            quality={1}
          />
        </div>
        <DownArrowIcon />
      </div>

      <div className={`${styles.menu} ${active && "visible"}`}>
        <h3 className={styles.subtitle}> Hola, {username} 👋</h3>
        <span>{email}</span>
        <ul>
          <li onClick={goAccount} className={styles.roundedButtonTerciary}>
            <UserIcon />
            Mi cuenta{" "}
          </li>
          <li onClick={logout} className={styles.roundedButtonFilled}>
            <DoorIcon />
            Cerrar sesión{" "}
          </li>
        </ul>
      </div>

      <style jsx>
        {`
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
