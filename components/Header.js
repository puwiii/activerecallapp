import React from "react";
import Link from "next/link";

//styles
import styles from "styles/Header.module.scss";

//hooks
import useUser, { USER_STATES } from "hooks/useUser";
import SpinnerComponentCircle from "./SpinnerComponentCircle";
import Avatar from "./Avatar";

function Header() {
  let user = useUser();

  return (
    <div className={styles.header}>
      <div className={styles.header__user}>
        {user === USER_STATES.NOT_LOGGED && (
          <div className={styles.header__user__buttons}>
            <Link href={"signin"} passHref={true}>
              <a className={styles.header__user__login}>
                Acceder
                {/* <RightArrowIcon /> */}
              </a>
            </Link>
            <Link href={"signin/createaccount"} passHref={true}>
              <a className={styles.header__user__signup}>
                Resgistrarme
                {/* <RightArrowIcon /> */}
              </a>
            </Link>
          </div>
        )}
        {user === USER_STATES.NOT_KNOWN && (
          <SpinnerComponentCircle withoutText={true} />
        )}
        {user && (
          <Avatar
            username={user.username}
            avatar={user.avatar}
            email={user.email}
          />
        )}
      </div>
    </div>
  );
}

export default Header;
