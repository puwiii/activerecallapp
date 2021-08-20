import { StateProvider } from "components/contexts/StateProvider";
import reducer, { initialState } from "components/contexts/reducer";
import Layout from "components/Layout";
import "styles/generals.scss";
import "styles/blabla.css";
import NavBar from "components/NavBar";
import Head from "components/Head";
import Header from "components/Header";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head />
      <NavBar />

      <div className="main">
        <Header />
        <Component {...pageProps} />
      </div>
      <style jsx>{`
        .main {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </Layout>
  );
}
