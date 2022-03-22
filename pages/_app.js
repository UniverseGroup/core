import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fortawesome/fontawesome-svg-core/styles.css'
// import dynamic from "next/dynamic";
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {useState} from "react";
// import LoadingScreen from '../components/LoadingScreen';
import {NextSeo} from "next-seo";
import dynamic from "next/dynamic";
const LoadingScreen = dynamic(() => import('../components/LoadingScreen'));
function MyApp({Component, pageProps}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
      const handleStart = () => {
          setLoading(true);
      }
      const handleStop = () => {
          setLoading(false);
      }

      router.events.on('routeChangeStart', handleStart)
      router.events.on('routeChangeComplete', handleStop)
      router.events.on('routeChangeError', handleStop)

      return () => {
        router.events.off('routeChangeStart', handleStart)
        router.events.off('routeChangeComplete', handleStop)
        router.events.off('routeChangeError', handleStop)
      }
    }, [router])
    return (
        <>
            <NextSeo noindex={true} />
            {
                loading ? (<LoadingScreen/>) : (<Component {...pageProps} />)
            }

        </>

    )
}

export default MyApp
