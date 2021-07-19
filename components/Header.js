import React from "react";
import Link from "next/link";

//styles
import styles from "styles/Header.module.scss";

//components
import Avatar from "components/Avatar";
import SpinnerComponent from "components/SpinnerComponent";

//hooks
import useUser, { USER_STATES } from "./hooks/useUser";

function Header() {
  let user = useUser();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" title="Página principal de Liza" className={styles.logo}>
          <img src="/images/liza_v2.svg" />
          {/* <Logo/> */}
        </a>
        <div className={styles.header__user}>
          {user === USER_STATES.NOT_LOGGED && (
            <>
              <Link href={"/signin"}>
                <button className={styles.roundedButtonTerciary}>
                  Iniciar sesión
                  {/* <RightArrowIcon /> */}
                </button>
              </Link>
              <Link href={"/signin/createaccount"}>
                <button className={styles.roundedButtonFilled}>
                  Crear cuenta
                  {/* <RightArrowIcon /> */}
                </button>
              </Link>
            </>
          )}
          {user === USER_STATES.NOT_KNOWN && <SpinnerComponent />}
          {user && (
            <Avatar
              username={user.username}
              avatar={user.avatar}
              email={user.email}
            />
          )}
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
