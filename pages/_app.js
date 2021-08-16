import { StateProvider } from "components/contexts/StateProvider";
import reducer, { initialState } from "components/contexts/reducer";
import Layout from "components/Layout";
import "styles/generals.scss";
import "styles/blabla.css";
import Header from "components/Header";
import Head from "components/Head";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head />
      <Header />

      <Component {...pageProps} />

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
