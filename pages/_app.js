import { StateProvider } from 'components/contexts/StateProvider'
import reducer, {initialState} from 'components/contexts/reducer';
import Layout from 'components/Layout'
import 'styles/generals.scss'
import Header from 'components/Header';
import Nav from 'components/Nav';

export default function MyApp({ Component, pageProps }) {
  return(
        <Layout>
            <Header/>
            <div>
              <Nav/>
              <Component {...pageProps} />
            </div>


            <style jsx>{`
                div{
                  height:100%;
                  display: flex;
                  flex-direction: column-reverse;
                }

                @media only screen and (min-width: 680px) {
                  div{
                    flex-direction: row;
                  }
                }
            `}</style>
        </Layout>
)}

