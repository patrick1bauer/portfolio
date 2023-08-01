import "@/styles/globals.css";
import React from "react";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
    <Head>
      <title>Patrick Bauer</title>
      <link rel="icon" type="image/png" href="/images/favicon.png"></link>
    </Head>
    <div className="App">
      <Component {...pageProps} />
    </div>
    </>
  );
}
