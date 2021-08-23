import React from "react";
import Link from "next/link";

//styles
import styles from "styles/Navbar.module.scss";
import componentsStyles from "styles/ComponentsStyles.module.scss";

//components
import Avatar from "components/Avatar";
import SpinnerComponent from "components/SpinnerComponent";
import Nav from "components/Nav";
import Header from "components/Header";

//hooks
import useUser, { USER_STATES } from "hooks/useUser";

//icons
import SearchIcon from "icons/SearchIcon";
import LogoSvg from "svgs/LogoSvg";

function NavBar() {
  let user = useUser();

  return (
    <header className={styles.navbar}>
      <a
        href="/"
        title="Página principal de Liza"
        className={styles.navbar__logo}
      >
        {/* <img src="/logo_v4.png" alt="Liza" /> */}
        <LogoSvg />
      </a>
      <Nav />
      <Header />
    </header>
  );
}

export default NavBar;
