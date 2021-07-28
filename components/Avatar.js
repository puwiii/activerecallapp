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

function Avatar({ username, avatar, email }) {
  const router = useRouter();
  const [active, setActive] = useState(false);

  const toggleMenu = () => {
    setActive(!active);
  };

  const goAccount = () => {
    router.push("/myaccount");
    setActive(!active);
  };

  const logout = () => {
    auth.signOut();
  };

  return (
    <div className={styles.avatarContainer}>
      <div onClick={toggleMenu} className={styles.avatar}>
        <div className={styles.avatar__image}>
          <Image src={avatar} layout="fill" objectFit="cover" />
        </div>
        <DownArrowIcon onClick={toggleMenu} />
      </div>

      <ul className="menu">
        <h3 className={styles.subtitle}> Hola, {username} 👋</h3>
        <span>{email}</span>
        <li onClick={goAccount} className={styles.roundedButtonTerciary}>
          <UserIcon />
          Mi cuenta{" "}
        </li>
        <li onClick={logout} className={styles.roundedButtonTerciary}>
          <DoorIcon />
          Cerrar sesión{" "}
        </li>
      </ul>

      <style jsx>
        {`
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
