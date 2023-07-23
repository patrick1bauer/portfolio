import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";

export default function App({ Component, pageProps }) {
  return (
    <div className="App">
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}
