import React from "react";
import Link from "next/link";

//styles
import styles from "styles/Header.module.scss";

//components
import Avatar from "components/Avatar";
import SpinnerComponent from "components/SpinnerComponent";
import Nav from "components/Nav";

//hooks
import useUser, { USER_STATES } from "hooks/useUser";

//icons
import SearchIcon from "icons/SearchIcon";
import LogoSvg from "svgs/LogoSvg";

function Header() {
  let user = useUser();

  return (
    <header className={styles.header}>
      <a href="/" title="Página principal de Liza" className={styles.logo}>
        {/* <img src="/logo_v4.png" alt="Liza" /> */}
        <LogoSvg height={42} width={70} />
      </a>
      <Nav />
      <div className={`${styles.searchInput} ${styles.header__searcher}`}>
        <SearchIcon />
        <input
          type="text"
          name="searchInput"
          id="searchInput"
          autoComplete="off"
          placeholder="Buscar en la comunidad 🌏..."
        />
      </div>
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
