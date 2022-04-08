import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fortawesome/fontawesome-svg-core/styles.css'
import {useRouter, Router} from 'next/router';
//import NProgress from 'nprogress'
import * as gtag from '../lib/gtag'
import { useEffect } from 'react';
//NProgress.configure({ showSpinner: true })
//Router.events.on('routeChangeStart', NProgress.start)
// Router.events.on('routeChangeComplete', ((url)=>{
//     NProgress.done
//     gtag.pageview(url)
// }))
//Router.events.on('routeChangeError', NProgress.done)
function MyApp({Component, pageProps}) {
    useEffect(()=>{
        const handleRouteChange = (url) => {
            gtag.pageview(url)
            //NProgress.done
          }
          Router.events.on('routeChangeComplete', handleRouteChange)
          return () => {
            Router.events.off('routeChangeComplete', handleRouteChange)
          }
        }, [Router.events])
    return <Component {...pageProps} />
}

export default MyApp
