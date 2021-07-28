import { StateProvider } from "components/contexts/StateProvider";
import reducer, { initialState } from "components/contexts/reducer";
import Layout from "components/Layout";
import "styles/generals.scss";
import "styles/blabla.css";
import Header from "components/Header";
import Nav from "components/Nav";
import styles from "styles/Global.module.scss";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Header />
      <div className={styles.mainDiv}>
        <Nav />
        <Component {...pageProps} />
      </div>

      {/* <style jsx>{`
                div{
                  position: relative;
                  overflow-y: hidden;
                  height:100%;
                  display: flex;
                  flex-direction: column-reverse;
                }
            `}</style> */}
    </Layout>
  );
}
