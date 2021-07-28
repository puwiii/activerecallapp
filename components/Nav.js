import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

//styles
import styles from "styles/Nav.module.scss";

//components
import ExploreIcon from "components/icons/ExploreIcon";
import CardsIcon from "components/icons/CardsIcon";
import FriendsIcon from "components/icons/FriendsIcon";
import PushLeftIcon from "components/icons/PushLeftIcon";
import PushRightIcon from "components/icons/PushRightIcon";

function Nav() {
  const [navContracted, setNavContracted] = useState();

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("navContracted") !== "undefined")
      setNavContracted(JSON.parse(localStorage.getItem("navContracted")));
    else {
      setNavContracted(false);
      localStorage.setItem("navContracted", navContracted);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("navContracted", navContracted);

    if (navContracted === true) {
      document.getElementById("nav").classList.remove(styles.expanded);
    } else {
      document.getElementById("nav").classList.add(styles.expanded);
    }
  }, [navContracted]);

  useEffect(() => {
    if (router.pathname.includes("decks")) {
      DecksLink.classList.add(styles.selected);
      if (ExploreLink.classList.contains(styles.selected))
        ExploreLink.classList.remove(styles.selected);
      return;
    } else {
      ExploreLink.classList.add(styles.selected);
      if (DecksLink.classList.contains(styles.selected))
        DecksLink.classList.remove(styles.selected);
    }
  }, [router.pathname]);

  return (
    <nav className={styles.nav} id="nav">
      <ul>
        <li title="Explorar" id="ExploreLink">
          <Link href={"/"}>
            <div>
              <ExploreIcon />
              <span>Explorar</span>
            </div>
          </Link>
        </li>
        <li title="Mis mazos" id="DecksLink">
          <Link href={`/decks`}>
            <div>
              <CardsIcon />
              <span>Mis mazos</span>
            </div>
          </Link>
        </li>
        <li title="Mis amigos" id="FriendsLink">
          <div>
            <FriendsIcon />
            <span>Amigos</span>
          </div>
        </li>
      </ul>
      {navContracted === false ? (
        <button
          onClick={(e) => setNavContracted(true)}
          title="Contraer"
          className={styles.roundedButtonTerciary}
        >
          <PushLeftIcon />
        </button>
      ) : (
        <button
          onClick={(e) => setNavContracted(false)}
          title="Expandir"
          className={styles.roundedButtonTerciary}
        >
          <PushRightIcon />
        </button>
      )}
    </nav>
  );
}

export default Nav;
