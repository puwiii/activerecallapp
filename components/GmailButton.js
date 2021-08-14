import GmailLogo from "components/logos/GmailLogo";
import styles from "styles/Global.module.scss";
import { loginWithGmail } from "firebase/client";
import { useRouter } from "next/router";

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
      <button onClick={(e) => login(e)}>
        Continuar con Google <br />
        <GmailLogo />
      </button>
    </>
  );
}

export default GmailButton;
