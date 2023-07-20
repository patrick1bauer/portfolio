import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="navigation">
      <nav>
        <ul className="navbar">
          <li className="navbar">
            <Link href="/" className="navbar-Link">
              Home
            </Link>
          </li>
          <li className="navbar">
            <Link href="/our-properties" className="navbar-Link">
              Experience
            </Link>
          </li>
          <li className="navbar">
            <Link href="/naples" className="navbar-Link">
              Adventures
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
