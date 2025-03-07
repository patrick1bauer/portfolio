import "@/styles/globals.css";
import React from "react";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
    <Head>
      <meta name="Porfolio page for Patrick Bauer. "/>
      <title>Patrick Bauer</title>
      <link rel="icon" type="image/png" href="/images/favicon.png"></link>
    </Head>
    <div className="App">
      <Component {...pageProps} />
    </div>
    </>
  );
}
