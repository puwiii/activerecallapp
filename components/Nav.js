import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

//styles
import styles from "styles/Nav.module.scss";

//icons
import ExploreIcon from "icons/ExploreIcon";
import CardsIcon from "icons/CardsIcon";
import FriendsIcon from "icons/FriendsIcon";
import PushLeftIcon from "icons/PushLeftIcon";
import PushRightIcon from "icons/PushRightIcon";

//hooks
import { useLocalStorage } from "hooks/useLocalStorage";
import ScreenLoadingComponent from "./ScreenLoadingComponent";

function Nav() {
  // const [navContracted, setNavContracted] = useLocalStorage(
  //   "navContracted",
  //   false
  // );

  // const [loading, setLoading] = useState(true);

  // const router = useRouter();

  // useEffect(() => {
  //   setLoading(false);
  // }, [navContracted]);

  // useEffect(() => {
  //   if (localStorage.getItem("navContracted") !== "undefined")
  //     setNavContracted(JSON.parse(localStorage.getItem("navContracted")));
  //   else {
  //     setNavContracted(false);
  //     localStorage.setItem("navContracted", navContracted);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("navContracted", navContracted);

  //   if (navContracted === true) {
  //     setNavContracted;
  //   } else {
  //     document.getElementById("nav").classList.add(styles.expanded);
  //   }
  // }, [navContracted]);

  // useEffect(() => {
  //   if (router.pathname.includes("decks")) {
  //     DecksLink.classList.add(styles.selected);
  //     if (ExploreLink.classList.contains(styles.selected))
  //       ExploreLink.classList.remove(styles.selected);
  //     return;
  //   } else {
  //     ExploreLink.classList.add(styles.selected);
  //     if (DecksLink.classList.contains(styles.selected))
  //       DecksLink.classList.remove(styles.selected);
  //   }
  // }, [router.pathname]);

  return (
    <nav className={styles.nav} id="nav">
      <ul>
        <li title="Explorar" id="ExploreLink">
          <Link href={"/"} passHref={true}>
            <a>
              <ExploreIcon />
              <span>Explorar</span>
            </a>
          </Link>
        </li>
        <li title="Mis mazos" id="DecksLink">
          <Link href={`/decks`} passHref={true}>
            <a>
              <CardsIcon />
              <span>Mis mazos</span>
            </a>
          </Link>
        </li>
        {/* <li title="Mis amigos" id="FriendsLink">
          <a>
            <FriendsIcon />
            <span>Amigos</span>
          </a>
        </li> */}
      </ul>

      {/* <button
            onClick={(e) => setNavContracted(!navContracted)}
            title={`${navContracted ? "Expandir" : "Contraer"}`}
            className={styles.roundedButtonTerciary}
          >
            {navContracted ? <PushRightIcon /> : <PushLeftIcon />}
          </button> */}
    </nav>
  );
}

export default Nav;
