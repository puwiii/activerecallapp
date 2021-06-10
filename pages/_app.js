import Layout from 'components/Layout'
import 'styles/generals.scss'

export default function MyApp({ Component, pageProps }) {
  return(
        <Layout>
          <Component {...pageProps} />
        </Layout>
)}

