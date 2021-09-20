import { useRouter } from "next/router";
import nProgress from "nprogress";
import { useEffect } from "react";
// import Axios from "axios";
// import { SWRConfig } from "swr";

import "../styles/globals.css";
import "nprogress/nprogress.css";
import Head from "next/head";

// Axios.defaults.baseURL = process.env.NEXT_SERVER_BASE_URL;
// Axios.defaults.withCredentials = true;

// const fetcher = async (url) => {
//   try {
//     const res = await Axios.get(url);
//     return res.data;
//   } catch (err) {
//     throw err.response.data;
//   }
// };

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      nProgress.start();
    };
    router.events.on("routeChangeStart", (url) => nProgress.start());
    router.events.on("routeChangeComplete", (url) => nProgress.done());

    return () => {
      router.events.off("routeChangeStart", (url) => nProgress.remove());
    };
  }, []);
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
