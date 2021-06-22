import React from "react";
import Link from "next/link";
import Logo from "components/logos/Logo";
import { useEffect } from "react";
import { auth, onAuthStateChanged } from "firebase/client";
import Avatar from "components/Avatar";
import styles from "styles/Header.module.scss";
import RightArrowIcon from "./icons/RightArrowIcon";
import useUser, { USER_STATES } from "./hooks/useUser";
import SpinnerComponent from "components/SpinnerComponent";

function Header() {
  let user = useUser();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" title="Página principal de Liza">
          <Logo />
        </a>
        <div className={styles.header__user}>
          {user === USER_STATES.NOT_LOGGED && (
            <Link href={"/signin"}>
              <button className={styles.roundedButtonFilled}>
                Iniciar sesión <RightArrowIcon />
              </button>
            </Link>
          )}
          {user === USER_STATES.NOT_KNOWN && <SpinnerComponent/>}
          {user && <Avatar username={user.username} avatar={user.avatar} email={user.email} />}
        </div>   
      </div>
      <style jsx>
        {`
          svg {
            margin-left: 25px;
          }
        `}
      </style>
    </header>
  );
}

export default Header;
