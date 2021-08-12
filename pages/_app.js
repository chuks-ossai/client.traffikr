import { useRouter } from 'next/router'
import nProgress from 'nprogress';
import { useEffect } from 'react';
import '../styles/globals.css'
import 'nprogress/nprogress.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      console.log('rout chenage')
      nProgress.start();
    }
    router.events.on('routeChangeStart', url => nProgress.start())
    router.events.on('routeChangeComplete',url => nProgress.done())

    return () => {
      router.events.off('routeChangeStart', url => nProgress.remove())
    }
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
