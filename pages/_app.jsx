import "@/styles/globals.css";
import React from "react";

export default function App({ Component, pageProps }) {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <Component {...pageProps} />
    </div>
  );
}
