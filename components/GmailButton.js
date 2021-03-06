import GmailLogo from "components/logos/GmailLogo";
import { loginWithGmail } from "firebase/client";
import { useRouter } from "next/router";

import styles from "styles/ComponentsStyles.module.scss";

function GmailButton() {
  const router = useRouter();

  const login = (e) => {
    e.preventDefault();
    loginWithGmail().then((credentials) => {
      router.push("/");
      console.log(credentials);
    });
  };

  return (
    <>
      <button onClick={(e) => login(e)} className={styles.gmailButton}>
        Acceder con Google
        <GmailLogo />
      </button>
    </>
  );
}

export default GmailButton;
