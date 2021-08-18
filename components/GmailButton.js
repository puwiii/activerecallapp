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
    });
  };

  return (
    <>
      <button onClick={(e) => login(e)} className={styles.gmailButton}>
        Continuar con Google
        <GmailLogo />
      </button>
    </>
  );
}

export default GmailButton;
